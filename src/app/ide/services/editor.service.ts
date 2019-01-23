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

    public editor;

    constructor(
        private _activityService: ActivityService,
        private _asyncDbService: AsyncDbService,
        private _asyncDBService: AsyncDbService,
    ) {
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
                        model.dispose();
                        const newModel = monaco.editor.createModel(
                            doc.content,
                            doc.mime,
                            getFileUriMethod(_id)
                        );
                        newModel.onDidChangeContent(async () => {
                            doc.content = model.getValue();
                            const newFile = await this._asyncDbService.localDB.put(doc);
                            doc._rev = newFile.rev;
                        });
                        if (_id === this._activityService.activeFile) {
                            this.editor.setModel(newModel);
                        }
                    }
                });
            });
    }

    setModelBaseOnActiveFile() {
        this._activeFileSubscription = this._activityService.activeFile$
            .asObservable()
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
                let model = monaco.editor.getModel(getFileUriMethod(fileId));
                if (model === null && !attachmentDetectMethod(file.mime)) {
                    model = monaco.editor.createModel(
                        file.content,
                        file.mime,
                        getFileUriMethod(fileId)
                    );
                    model.onDidChangeContent(async () => {
                        file.content = model.getValue();
                        const newFile = await this._asyncDbService.localDB.put(file);
                        file._rev = newFile.rev;
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
}
