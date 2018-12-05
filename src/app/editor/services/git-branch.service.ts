import {Injectable} from '@angular/core';
import * as git from 'vendor/git.js';
import {GitService} from './git.service';

@Injectable()
export class GitBranchService {
    constructor(
        private _gitService: GitService,
    ) {}

    async getRemoteBranch() {
        const info = await git.fetch({
            ...this._gitService.authInfo,
            dir: this._gitService.dir,
            url: this._gitService.url,
            ref: 'master',
            depth: 20,
            singleBranch: true,
            tags: true
        });
        console.log('done');
        console.log(info);

        const commits = await git.log({
            dir: this._gitService.dir,
            depth: 10,
            ref: 'master'
        });
        console.log(commits);
    }
}
