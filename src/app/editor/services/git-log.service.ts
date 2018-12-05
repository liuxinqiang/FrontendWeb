import {Injectable} from '@angular/core';
import {log, resolveRef, readObject, TREE, WORKDIR, STAGE, CommitDescription} from 'vendor/git.js';
import {GitService} from './git.service';
import {ComponentService} from './component.service';
import {GitMideaService} from 'app/common/services/git-midea.service';
import {GitAsyncStatus, GitCommit} from '../models/git.model';
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

    async calcAsyncStatus() {
        const asyncStatus: GitAsyncStatus = new GitAsyncStatus();
        const localCommits: CommitDescription[] = await log({
            dir: this._gitService.dir,
            ref: this._gitService.branch,
        });
        if (!localCommits.length) {
            return;
        }

        const firstLocalCommit = localCommits[localCommits.length - 1];
        const remoteCommits: any = await this._gitMideaService.getCommits(
            this._componentService.component.repo.gitMidea.id,
            this._gitService.branch,
            new Date(firstLocalCommit.author.timestamp * 1000).toISOString()
        );
        localCommits.reverse();
        remoteCommits.reverse();
        const minLength = Math.max(localCommits.length, remoteCommits.length);
        for (let i = 0; i < minLength; i++) {
            const lc = localCommits[i],
                rc = remoteCommits[i];
            if (!lc ||
                !rc ||
                lc.oid !== rc.id) {
                if (localCommits[i]) {
                    asyncStatus.toPush.push(
                        new GitCommit(
                            lc.oid,
                            lc.author.name,
                            lc.author.email,
                            lc.message,
                            lc.author.timestamp
                        )
                    );
                }
                if (remoteCommits[i]) {
                    asyncStatus.toPull.push(
                        new GitCommit(
                            rc.id,
                            rc.author_name,
                            rc.author_email,
                            rc.message,
                            Math.ceil(new Date(rc.authored_date).valueOf() / 1000)
                        )
                    );
                }
            }
        }
        this._gitActionService.setAsyncStatus(asyncStatus);
    }
}
