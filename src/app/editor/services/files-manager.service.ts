import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {IActiveFilesStorage, ITreeNode} from '../interfaces/panel.interface';
import {GitService} from './git.service';
import {LocalStorageService} from 'app/common/services/local-storage.service';
import {IComponentInterface} from '../../components/interfaces/component.interface';
import * as git from '../../../vendor/git';
import {GetFilesTreeMethod} from '../methods/files-tree.method';
import {ComponentService} from './component.service';

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
        private _localStorage: LocalStorageService,
        private _componentService: ComponentService,
    ) {
        this._filesSubject = new BehaviorSubject<ITreeNode[]>([]);
        this._activeFilesListSubject = new BehaviorSubject<ITreeNode[]>([]);
        this._activeFileSubject = new BehaviorSubject<ITreeNode>(null);
        this.files$ = this._filesSubject.asObservable();
        this.activeFilesList$ = this._activeFilesListSubject.asObservable();
        this.activeFile$ = this._activeFileSubject.asObservable();
    }

    setActiveFile(filePath: string) {
        let fileNode;
        let parentNode = this.files;
        const filePaths = filePath.split('/');

        for (let i = 1; i < filePaths.length; i ++) {
            const name = filePaths[i];
            if (i === (filePaths.length - 1)) {
                fileNode = parentNode.filter(file => !file.isDirectory && file.file === name)[0];
            } else {
                const tempParentNode = parentNode.filter(file => file.isDirectory && file.file === name)[0];
                if (tempParentNode) {
                    parentNode = tempParentNode.children;
                } else {
                    break;
                }
            }
        }
        if (fileNode) {
            this._activeFileSubject.next(fileNode);
            this.addActiveFile(fileNode);
        }
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

    async init() {
        const component: IComponentInterface = this._componentService.component;
        const files = await git.listFiles({dir: this._gitService.projectDir});
        const newFiles = GetFilesTreeMethod(files, this._gitService.projectDir);
        const activeFiles: IActiveFilesStorage = this._localStorage.getItem('ActiveFiles');
        if (activeFiles && activeFiles['component_' + component.componentName]) {
            const activeState = activeFiles['component_' + component.componentName];
            this._activeFilesListSubject.next(activeState.list);
            this._activeFileSubject.next(activeState.file);
        }
        this._filesSubject.next(newFiles);
    }
}
