import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {GitAsyncStatus, GitStatus} from '../models/git.model';
import {add, commit, push, status, statusMatrix, pull} from 'vendor/git';
import {GitService} from './git.service';
import {GitMideaService} from 'app/common/services/git-midea.service';
import {ComponentService} from './component.service';

const FILE = 0, HEAD = 1, WORKDIR = 2, STAGE = 3;

@Injectable()
export class GitActionService {

    private _status: BehaviorSubject<GitStatus>;

    public status$: Observable<GitStatus>;

    private _asyncStatus: BehaviorSubject<GitAsyncStatus>;

    public asyncStatus$: Observable<GitAsyncStatus>;

    constructor(
        private _gitService: GitService,
        private _componentService: ComponentService,
        private _gitMideaService: GitMideaService,
    ) {
        this._status = new BehaviorSubject(new GitStatus());
        this.status$ = this._status.asObservable();
        this._asyncStatus = new BehaviorSubject(new GitAsyncStatus());
        this.asyncStatus$ = this._asyncStatus.asObservable();
    }

    public get status(): GitStatus {
        return this._status.getValue();
    }

    public get pushStatusTotal(): Number {
        const value = this._status.getValue();
        return value.unStaged.length + value.staged.length + this.asyncStatus.toPush.length;
    }

    public get pullStatusTotal(): Number {
        return this.asyncStatus.toPull.length;
    }

    public get statusTotalArray(): [Number, Number] {
        const value = this._status.getValue();
        return [
            value.unStaged.length,
            value.staged.length,
        ];
    }

    public get asyncStatus(): GitAsyncStatus {
        return this._asyncStatus.getValue();
    }

    public get asyncStatusCount(): { push: number; pull: number } {
        return {
            push: this.asyncStatus.toPush.length,
            pull: this.asyncStatus.toPull.length,
        };
    }

    public setAsyncStatus(newStatus: GitAsyncStatus) {
        this._asyncStatus.next(newStatus);
    }

    public async add() {
        const allStatus = await this.init();
        const stagedFiles = allStatus.filter(row => row[WORKDIR] !== row[STAGE])
            .map(row => row[FILE]);
        for (let i = 0; i < stagedFiles.length; i++) {
            await add({dir: this._gitService.dir, filepath: stagedFiles[i]});
        }
        await this.init(true);
    }

    public async commit(message: string) {
        const user: any = await this._gitMideaService.user();
        const {name, email} = user;
        const sha = await commit({
            dir: this._gitService.dir,
            author: {
                name,
                email,
            },
            message,
        });
    }

    public async push() {
        const pushResponse = await push({
            dir: this._gitService.dir,
            remote: 'origin',
            ref: this._gitService.branch,
            ...this._gitService.authInfo,
        });
        return pushResponse;
    }

    public async pull() {
        const pushResponse = await pull({
            dir: this._gitService.dir,
            ref: this._gitService.branch,
            singleBranch: true,
            ...this._gitService.authInfo,
        });
        return pushResponse;
    }

    private _addUnStaged(filePath) {
        const states = Object.assign({}, this.status);
        if (states.unStaged.indexOf(filePath) === -1) {
            states.unStaged.push(filePath);
            this._status.next(states);
        }
    }

    private _addStaged(filePath) {
        const states = Object.assign({}, this.status);
        if (states.staged.indexOf(filePath) === -1) {
            states.staged.push(filePath);
            this._status.next(states);
        }
    }

    private _deleteUnStaged(filePath) {
        const states = Object.assign({}, this.status);
        const findPath = states.unStaged.indexOf(filePath);
        if (findPath >= 0) {
            states.unStaged.splice(findPath, 1);
            this._status.next(states);
        }
    }


    public async reCalcFileStatus(filepath: string): Promise<void> {
        const pathExist = this.status.unStaged.filter(path => path === filepath)[0];
        const state = await status({
            dir: this._gitService.dir,
            filepath: filepath.substr(this._gitService.dir.length + 1)
        });
        if (pathExist && ['unmodified', '*unmodified'].indexOf(state) >= 0) {
            this._deleteUnStaged(filepath);
        } else if (!pathExist && ['*modified', '*deleted', '*added'].indexOf(state) >= 0) {
            this._addUnStaged(filepath);
        }
    }


    public clear() {
        this._status.next(new GitStatus());
    }

    public async init(resetStatus = false) {
        const allStatus = await statusMatrix({
            dir: this._gitService.dir,
            pattern: null,
        });
        if (resetStatus) {
            this._status.next(new GitStatus());
        }
        allStatus.map(row => {
            const filePath = this._gitService.dir + '/' + row[FILE];
            if (row[WORKDIR] !== row[STAGE]) {
                this._addUnStaged(filePath);
            } else if (row[HEAD] !== row[WORKDIR]) {
                this._addStaged(filePath);
            }
        });
        return allStatus;
    }

}
