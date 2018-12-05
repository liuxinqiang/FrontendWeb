import {Injectable} from '@angular/core';
import {fetch, log} from 'vendor/git.js';
import {GitService} from './git.service';

@Injectable()
export class GitBranchService {
    constructor(
        private _gitService: GitService,
    ) {}

    async getRemoteBranch() {
        const info = await fetch({
            ...this._gitService.authInfo,
            dir: this._gitService.dir,
            url: this._gitService.url,
            ref: 'master',
            depth: 20,
            singleBranch: true,
            tags: true
        });

        const commits = await log({
            dir: this._gitService.dir,
            depth: 10,
            ref: 'master'
        });
    }
}
