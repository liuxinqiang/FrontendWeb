import {Injectable} from '@angular/core';
import * as git from 'vendor/git.js';
import {FilesService} from './files.service';
import {LoadingService, LoadingState} from './loading.service';
import {AuthService} from 'app/user/services/auth.service';
import {environment} from 'environments/environment';
import {IComponentInterface} from '../../components/interfaces/component.interface';
import {BehaviorSubject} from 'rxjs';
import {GetFilesTreeMethod} from '../methods/files-tree.method';
import {GitMideaService} from '../../common/services/git-midea.service';

interface GitStatus {
    unStaged: string[];
    staged: string[];
}

@Injectable()
export class GitService {

    constructor(
        private _filesService: FilesService,
        private _authService: AuthService,
        private _loadingService: LoadingService,
        private _gitMideaService: GitMideaService,
    ) {
        this._status = new BehaviorSubject({
            staged: [],
            unStaged: [],
        });
    }

    private _status: BehaviorSubject<GitStatus>;

    public projectDir: string;

    private _initStatus() {
        this._status.next({
            staged: [],
            unStaged: [],
        });
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
        const status = await this._calcStatus();
        const stagedFiles = status.filter(row => row[WORKDIR] !== row[STAGE])
            .map(row => row[FILE]);
        this._loadingService.setState({
            state: LoadingState.loading,
            message: '共需保存' + stagedFiles.length + '个文件',
        });
        for (let i = 0; i < stagedFiles.length; i++) {
            await git.add({ dir: this.projectDir, filepath: stagedFiles[i] });
        }
        this._initStatus();
        await this._calcStatus();
        this._loadingService.setState({
            state: LoadingState.success,
            message: '保存成功',
        });
    }

    public async commit() {
        const user: any = await this._gitMideaService.user();
        const {name, email} = user;
        const sha = await git.commit({
            dir: this.projectDir,
            author: {
                name,
                email,
            },
            message: '从浏览器开始的第一个提交'
        });

        const pushResponse = await git.push({
            dir: this.projectDir,
            remote: 'origin',
            ref: 'master',
            oauth2format: 'gitlab',
            token: this._authService.currentUserValue.user.authTokens.gitMidea.token,
        });
        console.log(pushResponse);

        this._initStatus();
        await this._calcStatus();
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
            dir: this.projectDir,
            filepath: filepath.substr(this.projectDir.length + 1)
        });
        if (pathExist && ['unmodified', '*unmodified'].indexOf(state) >= 0) {
            this._deleteUnStaged(filepath);
        } else if (!pathExist && ['*modified', '*deleted', '*added'].indexOf(state) >= 0) {
            this._addUnStaged(filepath);
        }
    }

    public clear() {
        this._initStatus();
    }

    public get statusTotal(): Number {
        const value = this._status.getValue();
        return value.unStaged.length || value.staged.length;
    }

    public get statusTotalArray(): [Number, Number] {
        const value = this._status.getValue();
        return [
            value.unStaged.length,
            value.staged.length
        ];
    }

    async _calcStatus() {
        const FILE = 0, HEAD = 1, WORKDIR = 2, STAGE = 3;
        const status = await git.statusMatrix({
            dir: this.projectDir
        });
        status.map(row => {
            const filePath = this.projectDir + '/' + row[FILE];
            if (row[WORKDIR] !== row[STAGE]) {
                this._addUnStaged(filePath);
            } else if (row[HEAD] !== row[WORKDIR]) {
                this._addStaged(filePath);
            }
        });
        return status;
    }

    async getBranches() {
        // const info = await git.getRemoteInfo({
        //     url: 'https://git-midea.liuxinqiang.com/test',
        //     oauth2format: 'gitlab',
        //     token: this._authService.currentUserValue.user.metaData.gitMidea.token,
        // });
        // console.log('remote info...');
        // console.log(info);

        const currentBranch = await git.currentBranch({dir: this.projectDir});
        console.log('current branches');
        console.log(currentBranch);

        const branches = await git.listBranches({dir: this.projectDir});
        console.log('local branches');
        console.log(branches);
        const remoteBranches = await git.listBranches({dir: this.projectDir, remote: 'origin'});
        console.log('remote branches');
        console.log(remoteBranches);
    }

    async initGit(component: IComponentInterface): Promise<any[]> {
        this.projectDir = `${this._authService.currentUserValue.user.loginName}_component_${component.componentName}`;
        const gitRepo = `${environment.gitMidea.url}/${component.repo.gitMidea.path}.git`;
        const fs = await this._filesService.init();
        this._loadingService.setState({
            state: LoadingState.loading,
            message: '设置代码仓库',
        });
        git.plugins.set('fs', fs);
        let exist;
        try {
            exist = await this._filesService.fs.exists(this.projectDir);
        } catch (e) {
            exist = true;
        }
        if (!exist) {
            await this._filesService.fs.mkdir(this.projectDir);
            await git.clone({
                oauth2format: 'gitlab',
                token: this._authService.currentUserValue.user.authTokens.gitMidea.token,
                dir: this.projectDir,
                url: gitRepo,
                ref: component.repo.gitMidea.branch,
                singleBranch: true,
                depth: 5
            });
        }
        // calc status
        this._calcStatus().then();
        const files = await git.listFiles({dir: this.projectDir});
        return GetFilesTreeMethod(files, this.projectDir);
    }
}
