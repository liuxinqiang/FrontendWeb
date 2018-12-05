import {Injectable} from '@angular/core';
import {log, resolveRef, readObject, TREE, WORKDIR, STAGE} from 'vendor/git.js';
import {GitService} from './git.service';
import {ILocalCommitDescription} from '../interfaces/git.interface';
import {ComponentService} from './component.service';
import {GitMideaService} from 'app/common/services/git-midea.service';
import {GitAsyncStatus} from '../models/git.model';
import {GitActionService} from './git-action.service';

@Injectable()
export class GitLogService {

    constructor(
        private _gitService: GitService,
        private _componentService: ComponentService,
        private _gitMideaService: GitMideaService,
        private _gitActionService: GitActionService,
    ) {
    }

    public get repo() {
        return this._componentService.component.repo.gitMidea;
    }

    async calcAsyncStatus() {

        const currentCommit = await resolveRef({ dir: this._gitService.dir, ref: this.repo.branch });

        let { object: blob } = await readObject({
            dir: this._gitService.dir,
            oid: currentCommit,
            encoding: 'utf8'
        });

        const asyncStatus: GitAsyncStatus = new GitAsyncStatus();
        const localCommits: ILocalCommitDescription[] = await log({
            dir: this._gitService.dir,
            ref: this.repo.branch,
        });
        if (!localCommits.length) {
            return;
        }

        const firstLocalCommit = localCommits[localCommits.length - 1];
        const remoteCommits: any = await this._gitMideaService.getCommits(
            this.repo.id,
            this.repo.branch,
            new Date(firstLocalCommit.author.timestamp * 1000).toISOString()
        );
        localCommits.reverse();
        remoteCommits.reverse();
        const minLength = Math.max(localCommits.length, remoteCommits.length);
        for (let i = 0; i < minLength; i++) {
            if (!localCommits[i] ||
                !remoteCommits[i] ||
                localCommits[i].oid !== remoteCommits[i].id) {
                if (localCommits[i]) {
                    // asyncStatus.toPush.push(localCommits[i]);
                }
                if (remoteCommits[i]) {
                    // asyncStatus.toPull.push(remoteCommits[i]);
                }
            }
        }
        this._gitActionService.setAsyncStatus(asyncStatus);
    }
}
