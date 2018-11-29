import {Injectable} from '@angular/core';
import {FilesManagerService} from './files-manager.service';
import {FilesService} from './files.service';
import {filter} from 'rxjs/operators';
import {EditorMapConfig} from '../editor.config';
import {Subscription} from 'rxjs';
import {ITreeNode} from '../interfaces/panel.interface';
import {LoadingService} from './loading.service';

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
    private _activeFileSubscription: Subscription;
    private _filesSubscription: Subscription;
    public editor;

    constructor(
        private _filesManagerService: FilesManagerService,
        private _fileService: FilesService,
        private _loadingService: LoadingService,
    ) {}
    clear() {
        const models = monaco.editor.getModels();
        models.forEach(model => model.dispose());
        this.editor = undefined;
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
            this._loadingService.setState('');
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
                        if (this.editor) {
                            this.editor.setModel(null);
                        }
                        return false;
                    }
                })
            )
            .subscribe(async file => {
                const model = monaco.editor.getModel(monaco.Uri.parse(file.url));
                if (!this.editor) {
                    this.editor = monaco.editor.create(this._container, {
                        model: model,
                        theme: 'vs-dark',
                        language: 'text/plain',
                    });
                } else {
                    this.editor.setModel(model);
                }
            });
    }

    layout() {
        if (this.editor) {
            this.editor.layout();
        }
    }

    init(editorContainer: HTMLDivElement) {
        this._loadingService.setState('设置编辑器');
        this._container = editorContainer;
        this.setModelsBaseOnFiles();
    }
}
