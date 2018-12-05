import {Injectable} from '@angular/core';
import {FilesManagerService} from './files-manager.service';
import {FileService} from './file.service';
import {filter} from 'rxjs/operators';
import {EditorMapConfig, IgnoredEditorTypes} from '../editor.config';
import {Subscription} from 'rxjs';
import {ITreeNode} from '../interfaces/panel.interface';
import {LoadingService, LoadingState} from './loading.service';
import {GitService} from './git.service';
import {GitActionService} from './git-action.service';

function getFlatFiles(files: ITreeNode[]) {
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
    private _readOnlyMode = false;
    private _container: HTMLDivElement;
    private _activeFileSubscription: Subscription;
    private _filesSubscription: Subscription;
    public editor;

    constructor(
        private _filesManagerService: FilesManagerService,
        private _fileService: FileService,
        private _loadingService: LoadingService,
        private _gitService: GitService,
        private _gitActionService: GitActionService,
    ) {
    }

    setReadOnly(value) {
        this._readOnlyMode = value;
    }

    public get readOnly(): boolean {
        return this._readOnlyMode;
    }

    clear() {
        const models = monaco.editor.getModels();
        models.forEach(model => model.dispose());
        this.editor = undefined;
        if (this._activeFileSubscription) {
            this._activeFileSubscription.unsubscribe();
        }
        if (this._filesSubscription) {
            this._filesSubscription.unsubscribe();
        }
    }

    setModelsBaseOnFiles() {
        this._filesSubscription = this._filesManagerService.files$.subscribe(async files => {
            const flatFiles = getFlatFiles(files);
            for (const file of flatFiles) {
                const ignoredType = IgnoredEditorTypes.indexOf(file.ext) >= 0;
                const value = ignoredType ? file.path : await this._fileService.readTextFile(file.path);
                const model = monaco.editor.createModel(
                    value,
                    EditorMapConfig[file.ext] || 'text/plain',
                    monaco.Uri.parse(file.url)
                );
                if (!ignoredType) {
                    model.onDidChangeContent(async () => {
                        await this._fileService.writeTextFile(file.path, model.getValue());
                    });
                }
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
                        if (this.editor) {
                            this.editor.setModel(null);
                        }
                        return false;
                    }
                })
            )
            .subscribe(async file => {
                this._loadingService.setState({
                    state: LoadingState.loading,
                    message: '正在读取 ' + file.file,
                });
                let model = monaco.editor.getModel(monaco.Uri.parse(file.url));
                if (model === null) {
                    const ignoredType = IgnoredEditorTypes.indexOf(file.ext) >= 0;
                    const value = ignoredType ? file.path : await this._fileService.readTextFile(file.path);
                    model = monaco.editor.createModel(
                        value,
                        EditorMapConfig[file.ext] || 'text/plain',
                        monaco.Uri.parse(file.url)
                    );
                    if (!ignoredType) {
                        model.onDidChangeContent(async () => {
                            await this._fileService.writeTextFile(file.path, model.getValue());
                            await this._gitActionService.reCalcFileStatus(file.path);
                        });
                    }
                }
                if (!this.editor) {
                    this.editor = monaco.editor.create(this._container, {
                        model: model,
                        theme: 'vs-dark',
                        language: 'text/plain',
                        readOnly: this._readOnlyMode,
                    });
                } else {
                    this.editor.setModel(model);
                }
                this._loadingService.setState({
                    state: LoadingState.success,
                    message: '读取成功',
                });
            });
    }

    layout() {
        if (this.editor) {
            this.editor.layout();
        }
    }

    init(editorContainer: HTMLDivElement) {
        this._container = editorContainer;
        this.setModelBaseOnActiveFile();
        // this.setModelsBaseOnFiles();
    }
}
