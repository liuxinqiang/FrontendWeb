import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class ActivityService {

    private _activeFile: BehaviorSubject<string | null>;
    private _openedFiles: BehaviorSubject<string[]>;
    public activeFile$: Observable<string | null>;
    public openedFiles$: Observable<string[]>;

    constructor() {
        this._activeFile = new BehaviorSubject(null);
        this._openedFiles = new BehaviorSubject([]);
        this.activeFile$ = this._activeFile.asObservable();
        this.openedFiles$ = this._openedFiles.asObservable();
    }

    public get activeFile() {
        return this._activeFile.getValue();
    }

    public get openedFiles() {
        return this._openedFiles.getValue();
    }

    public setActiveFile(file: string | null) {
        if (this.activeFile === file) {
            return;
        }
        if (this.openedFiles.indexOf(file) === -1) {
            this.openedFiles.push(file);
        }
        this._activeFile.next(file);
        this._openedFiles.next(this.openedFiles);
    }

    public closeOpenedFiles(files: string[]) {
        const openedFiles = Array.from(this.openedFiles);
        let activeFileIndex = -1;
        for (let i = 0; i < files.length; i++) {
           const file = files[i];
           const findIndex = openedFiles.indexOf(file);
           if (findIndex === -1) {
               continue;
           }
           if (file === this.activeFile) {
               activeFileIndex = findIndex;
           }
            openedFiles.splice(findIndex, 1);
        }
        this._openedFiles.next(openedFiles);
        if (activeFileIndex !== -1) {
            this._activeFile.next(openedFiles[activeFileIndex] || openedFiles[0] || null);
        }
    }

    public clear() {
        this._activeFile.next(null);
        this._openedFiles.next([]);
    }
}
