import {Injectable} from '@angular/core';
import * as git from 'vendor/git.js';
import {FilesService} from './files.service';
import {LoadingService} from './loading.service';
import {AuthService} from '../../user/services/auth.service';
import {IEditorQuery} from '../interfaces/files.interface';
import {environment} from '../../../environments/environment';
import {ComponentService} from './component.service';
import {IComponentInterface} from '../../components/interfaces/component.interface';

@Injectable()
export class GitService {

    private _dir: string;

    async getStatus() {
        console.time('status');
        const FILE = 0, HEAD = 1, WORKDIR = 2, STAGE = 3;
        console.log('./' + this._dir + '/.git');
        const status = await git.statusMatrix({
            dir: this._dir
        });
        console.log('deleted...');
        console.log(status.filter(row => row[WORKDIR] === 0)
            .map(row => row[FILE]));
        console.log('unstaged...');
        console.log(status.filter(row => row[WORKDIR] !== row[STAGE])
            .map(row => row[FILE]));
        console.log('modified');
        console.log(status.filter(row => row[HEAD] !== row[WORKDIR])
            .map(row => row[FILE]));
        console.timeEnd('status');
    }

    async getBranches() {

        // const info = await git.getRemoteInfo({
        //     url: 'https://git-midea.liuxinqiang.com/test',
        //     oauth2format: 'gitlab',
        //     token: this._authService.currentUserValue.user.metaData.gitMidea.token,
        // });
        // console.log('remote info...');
        // console.log(info);

        const currentBranch = await git.currentBranch({ dir: this._dir });
        console.log('current branches');
        console.log(currentBranch);

        const branches = await git.listBranches({ dir: this._dir });
        console.log('local branches');
        console.log(branches);
        const remoteBranches = await git.listBranches({ dir: this._dir, remote: 'origin' });
        console.log('remote branches');
        console.log(remoteBranches);
    }

    constructor(
        private _filesService: FilesService,
        private _authService: AuthService,
        private _loadingService: LoadingService
    ) {
        setTimeout(() => {
            this.getStatus().then();
            this.getBranches().then();
        }, 5000);
    }

    async initGit(component: IComponentInterface): Promise<any[]> {
        this._dir = `${this._authService.currentUserValue.user.loginName}_component_${component.componentName}`;
        const gitRepo = `${environment.gitMidea.url}/${component.repo.gitMidea.path}.git`;
        const fs = await this._filesService.init();
        this._loadingService.setState('设置代码仓库');
        git.plugins.set('fs', fs);
        let exist;
        try {
            exist = await this._filesService.fs.exists(this._dir);
        } catch (e) {
            exist = true;
        }
        if (!exist) {
            await this._filesService.fs.mkdir(this._dir);
            await git.clone({
                oauth2format: 'gitlab',
                token: this._authService.currentUserValue.user.authTokens.gitMidea.token,
                dir: this._dir,
                url: gitRepo,
                ref: 'master',
                singleBranch: true,
            });
        }
        return this._filesService.getTree(this._dir);
    }
}
