import {Injectable} from '@angular/core';
import {FilesManagerService} from './files-manager.service';
import {FilesService} from './files.service';
import {filter} from 'rxjs/operators';
import {EditorMapConfig} from '../editor.config';
import {Subscription} from 'rxjs';
import {ITreeNode} from '../interfaces/panel.interface';

function getFlatFiles (files: ITreeNode[]) {
    const result = [];
    function flatFiles(array: ITreeNode[]) {
        array.forEach(item => {
            if (!item.isDirectory) {
                result.push(item);
            } else if (item.children.length) {
                flatFiles(item.children);
            }
        });
    }
    flatFiles(files);
    return result;
}

@Injectable()
export class EditorsManagerService {
    private _container: HTMLDivElement;
    private _editor;
    private _activeFileSubscription: Subscription;
    private _filesSubscription: Subscription;

    constructor(
        private _filesManagerService: FilesManagerService,
        private _fileService: FilesService,
    ) {
    }
    clear() {
        const models = monaco.editor.getModels();
        models.forEach(model => model.dispose());
        this._editor = undefined;
        this._activeFileSubscription.unsubscribe();
        this._filesSubscription.unsubscribe();
    }

    setModelsBaseOnFiles() {
        this._filesSubscription = this._filesManagerService.files$.subscribe(async files => {
            const flatFiles = getFlatFiles(files);
            for (const file of flatFiles) {
                const value = await this._fileService.readTextFile(file.path);
                const model = monaco.editor.createModel(
                    value,
                    EditorMapConfig[file.ext] || 'text/plain',
                    monaco.Uri.parse(file.url)
                );
                model.onDidChangeContent(async () => {
                    await this._fileService.writeTextFile(file.path, model.getValue());
                });
            }
            this.setModelBaseOnActiveFile();
        });
    }

    setModelBaseOnActiveFile() {
        this._activeFileSubscription = this._filesManagerService.activeFile$
            .pipe(
                filter(file => {
                    if (file !== null) {
                        return true;
                    } else {
                        if (this._editor) {
                            this._editor.setModel(null);
                        }
                        return false;
                    }
                })
            )
            .subscribe(async file => {
                const model = monaco.editor.getModel(monaco.Uri.parse(file.url));
                if (!this._editor) {
                    this._editor = monaco.editor.create(this._container, {
                        model: model,
                        theme: 'vs-dark',
                        language: 'text/plain',
                    });
                } else {
                    this._editor.setModel(model);
                }
            });
    }

    init(editorContainer: HTMLDivElement) {
        this._container = editorContainer;
        this.setModelsBaseOnFiles();
    }
}
