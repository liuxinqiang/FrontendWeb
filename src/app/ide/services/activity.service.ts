import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class ActivityService {
    activeFile$: BehaviorSubject<string | null>;

    openedFiles$: BehaviorSubject<string[]>;

    constructor() {
        this.activeFile$ = new BehaviorSubject(null);
        this.openedFiles$ = new BehaviorSubject([]);
    }

    public get activeFile() {
        return this.activeFile$.getValue();
    }

    public get openedFiles() {
        return this.openedFiles$.getValue();
    }

    public setActiveFile(file: string | null) {
        if (this.activeFile === file) {
            return;
        }
        if (this.openedFiles.indexOf(file) === -1) {
            this.openedFiles.push(file);
        }
        this.activeFile$.next(file);
        this.openedFiles$.next(this.openedFiles);
    }

    public closeOpenedFiles(files: string[]) {
        let activeFileIndex = -1;
        for (let i = 0; i < files.length; i++) {
           const file = files[i];
           const findIndex = this.openedFiles.indexOf(file);
           if (findIndex === -1) {
               continue;
           }
           if (file === this.activeFile) {
               activeFileIndex = findIndex;
           }
           this.openedFiles.splice(findIndex, 1);
        }
        this.openedFiles$.next(this.openedFiles);
        if (activeFileIndex !== -1) {
            this.activeFile$.next(this.openedFiles[activeFileIndex] || this.openedFiles[0] || null);
        }
    }
}
