import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {GitStatus} from '../models/git.model';
import {LoadingService, LoadingState} from './loading.service';
import * as git from '../../../vendor/git';
import {GitService} from './git.service';
import {GitMideaService} from '../../common/services/git-midea.service';

@Injectable()
export class GitActionService {

    private _status: BehaviorSubject<GitStatus>;

    public status$: Observable<GitStatus>;

    constructor(
        private _loadingService: LoadingService,
        private _gitService: GitService,
        private _gitMideaService: GitMideaService,
    ) {
        this._status = new BehaviorSubject(new GitStatus());
        this.status$ = this._status.asObservable();
    }

    public get status(): GitStatus {
        return this._status.getValue();
    }

    public async add() {
        this._loadingService.setState({
            state: LoadingState.loading,
            message: '计算待保存文件',
        });
        const FILE = 0, WORKDIR = 2, STAGE = 3;
        const status = await this.init();
        const stagedFiles = status.filter(row => row[WORKDIR] !== row[STAGE])
            .map(row => row[FILE]);
        this._loadingService.setState({
            state: LoadingState.loading,
            message: '共需保存' + stagedFiles.length + '个文件',
        });
        for (let i = 0; i < stagedFiles.length; i++) {
            await git.add({dir: this._gitService.projectDir, filepath: stagedFiles[i]});
        }
        this._status.next(new GitStatus());
        await this.init();
        this._loadingService.setState({
            state: LoadingState.success,
            message: '保存成功',
        });
    }

    public async commit(message: string) {
        const user: any = await this._gitMideaService.user();
        const {name, email} = user;
        const sha = await git.commit({
            dir: this._gitService.projectDir,
            author: {
                name,
                email,
            },
            message,
        });
        this._status.next(new GitStatus());
        await this.init();
    }

    public async push() {
        const pushResponse = await git.push({
            dir: this._gitService.projectDir,
            remote: 'origin',
            ref: 'master',
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
        const state = await git.status({
            dir: this._gitService.projectDir,
            filepath: filepath.substr(this._gitService.projectDir.length + 1)
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

    public get statusTotal(): Number {
        const value = this._status.getValue();
        return value.unStaged.length || value.staged.length;
    }

    public get statusTotalArray(): [Number, Number] {
        const value = this._status.getValue();
        return [
            value.unStaged.length,
            value.staged.length,
        ];
    }

    public async init() {
        const FILE = 0, HEAD = 1, WORKDIR = 2, STAGE = 3;
        const status = await git.statusMatrix({
            dir: this._gitService.projectDir
        });
        status.map(row => {
            const filePath = this._gitService.projectDir + '/' + row[FILE];
            if (row[WORKDIR] !== row[STAGE]) {
                this._addUnStaged(filePath);
            } else if (row[HEAD] !== row[WORKDIR]) {
                this._addStaged(filePath);
            }
        });
        return status;
    }

}
