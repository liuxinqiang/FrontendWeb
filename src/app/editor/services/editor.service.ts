import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {IActiveFilesStorage, ITreeNode} from '../interfaces/panel.interface';
import {GitService} from './git.service';
import {LocalStorageService} from 'app/common/services/storage/local-storage.service';
import {IEditorQuery} from '../interfaces/files.interface';

@Injectable()
export class EditorService {
    private _filesSubject: BehaviorSubject<ITreeNode[]>;
    private _activeFilesListSubject: BehaviorSubject<ITreeNode[]>;
    private _activeFileSubject: BehaviorSubject<ITreeNode>;
    public files$: Observable<ITreeNode[]>;
    public activeFilesList$: Observable<ITreeNode[]>;
    public activeFile$: Observable<ITreeNode>;

    constructor(
        private _gitService: GitService,
        private _localStorage: LocalStorageService
    ) {
        this._filesSubject = new BehaviorSubject<ITreeNode[]>([]);
        this._activeFilesListSubject = new BehaviorSubject<ITreeNode[]>([]);
        this._activeFileSubject = new BehaviorSubject<ITreeNode>(null);
        this.files$ = this._filesSubject.asObservable();
        this.activeFilesList$ = this._activeFilesListSubject.asObservable();
        this.activeFile$ = this._activeFileSubject.asObservable();
        this.activeFilesList$.subscribe(newFileList => {
            if (!newFileList.length
                || !newFileList.filter(file => file.path === this.activeFile.path).length) {
                this._activeFileSubject.next(null);
            }
        });
    }

    public get files(): ITreeNode[] {
        return this._filesSubject.value;
    }

    public get activeFile(): ITreeNode {
        return this._activeFileSubject.value;
    }

    public get activeFilesList(): ITreeNode[] {
        return this._activeFilesListSubject.value;
    }

    async init(query: IEditorQuery) {
        const newFiles = await this._gitService.initGit();
        const activeFiles: IActiveFilesStorage = this._localStorage.getItem('ActiveFiles');
        if (activeFiles && activeFiles[query.type + '_' + query.name]) {
            const activeState = activeFiles[query.type + '_' + query.name];
            this._activeFilesListSubject.next(activeState.list);
            this._activeFileSubject.next(activeState.file);
        }
        this._filesSubject.next(newFiles);
    }
}
