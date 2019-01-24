import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivityService} from './activity.service';
import {filter, map} from 'rxjs/operators';
import {attachmentDetectMethod} from '../methods/attachment-detect.method';
import {IFile} from '../interfaces/file.interface';
import {AsyncDbService} from './async-db.service';
import {getFileUriMethod} from '../methods/file-uri.method';

@Injectable()
export class EditorService {

    private _container: HTMLDivElement;

    private _activeFileSubscription: Subscription;

    public toSaveQueues = {};

    public editor;

    constructor(
        private _activityService: ActivityService,
        private _asyncDbService: AsyncDbService,
        private _asyncDBService: AsyncDbService,
    ) {
    }

    private async _localSave(fileId) {
        const model = monaco.editor.getModel(getFileUriMethod(fileId));
        const newContent = model.getValue();
        const doc = await this._asyncDBService.localDB.get(fileId);
        if (doc.content !== newContent) {
            doc.content = newContent;
            await this._asyncDbService.localDB.put(doc);
        }
    }

    contentChange() {
        this._asyncDBService.remoteChanges$
            .pipe(
                filter(data => data !== null && data.direction === 'pull'),
                map(data => data.change.docs)
            )
            .subscribe(docs => {
                docs.forEach(doc => {
                    const {_id} = doc;
                    const model = monaco.editor.getModel(getFileUriMethod(_id));
                    if (model !== null) {
                        model.setValue(doc.content);
                    }
                });
            });
    }

    setModelBaseOnActiveFile() {
        this._activeFileSubscription = this._activityService.activeFile$
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
            .subscribe(async fileId => {
                const file: IFile = await this._asyncDbService.localDB.get(fileId);
                const fileUrl = getFileUriMethod(fileId);
                let model = monaco.editor.getModel(fileUrl);
                if (model === null && !attachmentDetectMethod(file.mime)) {
                    const language = file.mime === null ? 'text' : file.mime.substr(file.mime.indexOf('/') + 1);
                    model = monaco.editor.createModel(
                        file.content,
                        language,
                        fileUrl
                    );
                    model.onDidChangeContent(async () => {
                        if (this.toSaveQueues[fileId]) {
                            clearTimeout(this.toSaveQueues[fileId]);
                        }
                        this.toSaveQueues[fileId] = setTimeout(() => {
                            this.toSaveQueues[fileId] = undefined;
                            this._localSave(fileId).then();
                        }, 300);
                    });
                }
                if (!this.editor) {
                    this.editor = monaco.editor.create(this._container, {
                        model: model,
                        theme: 'vs-dark',
                        language: file.mime,
                        readOnly: false,
                    });
                } else {
                    this.editor.setModel(model);
                }
            });
    }

    init(editorContainer: HTMLDivElement) {
        this._container = editorContainer;
        this.setModelBaseOnActiveFile();
        this.contentChange();
    }

    clear() {
        this.editor = undefined;
        if (this._activeFileSubscription) {
            this._activeFileSubscription.unsubscribe();
        }
        monaco.editor.getModels().map(model => model.dispose());
    }
}
