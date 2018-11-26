import {Injectable} from '@angular/core';
import * as git from 'vendor/git.js';
import {FilesService} from './files.service';
import {AuthService} from '../../common/services/auth/auth.service';

@Injectable()
export class GitService {

    constructor(
        private _filesService: FilesService,
        private _authService: AuthService,
    ) {
    }

    async initGit(
        dir = 'liuxinqiang_components_test',
        gitRepo = 'https://git-midea.liuxinqiang.com/Frontend/UI.git',
        branch = 'master',
        singleBranch = false
    ): Promise<any[]> {
        const fs = await this._filesService.init();
        git.plugins.set('fs', fs);
        let exist;
        try {
            exist = await this._filesService.fs.exists(dir);
        } catch (e) {
            exist = true;
        }
        if (!exist) {
            await this._filesService.fs.mkdir(dir);
            await git.clone({
                oauth2format: 'gitlab',
                token: this._authService.currentUserValue.user.gitLibToken || 'hW2ox9S6w2Swspyunwy2',
                dir,
                url: gitRepo,
                ref: branch,
                singleBranch
            });
        }
        return this._filesService.getTree(dir);
    }
}
