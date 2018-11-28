import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {IActiveFilesStorage, ITreeNode} from '../interfaces/panel.interface';
import {GitService} from './git.service';
import {LocalStorageService} from 'app/common/services/storage/local-storage.service';
import {IEditorQuery} from '../interfaces/files.interface';

@Injectable()
export class FilesManagerService {
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
    }

    setActiveFile(node: ITreeNode) {
        this._activeFileSubject.next(node);
        this.addActiveFile(node);
    }

    addActiveFile(node: ITreeNode) {
        if (this.activeFilesList.filter(file => file.path === node.path)[0]) {
            return;
        }
        const newFileList = Array.from(this.activeFilesList);
        newFileList.push(node);
        this._activeFilesListSubject.next(newFileList);
    }

    removeActiveFile(node: ITreeNode) {
        let toDeleteIndex = -1;
        const newFileList = Array.from(this.activeFilesList);
        newFileList.forEach((file, index) => {
            if (file.path === node.path) {
                toDeleteIndex = index;
            }
        });
        if (toDeleteIndex !== -1) {
            newFileList.splice(toDeleteIndex, 1);
        }
        if (!newFileList.length) {
            this._activeFileSubject.next(null);
        } else if (node.path === this.activeFile.path) {
            const activeCursor = toDeleteIndex > (newFileList.length - 1)
                ? (newFileList.length - 1) : toDeleteIndex;
            this._activeFileSubject.next(newFileList[activeCursor]);
        }
        this._activeFilesListSubject.next(newFileList);
    }

    clear() {
        this._activeFilesListSubject.next([]);
        this._activeFileSubject.next(null);
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
