import {Component, ElementRef, ViewChild} from '@angular/core';
import {GitStatus} from '../../models/git.model';
import {GitActionService} from '../../services/git-action.service';
import {GitService} from '../../services/git.service';
import {GitLogService} from '../../services/git-log.service';
import {LoadingService, LoadingState} from '../../services/loading.service';

@Component({
    selector: 'app-header-submit-panel',
    templateUrl: './header-submit-panel.component.html',
    styleUrls: ['./header-submit-panel.component.less']
})
export class HeaderSubmitPanelComponent {
    message: string;

    loading = {
        add: false,
        commit: false,
        push: false,
    };

    @ViewChild('switcher') switcherRef: ElementRef;

    constructor(
        public gitActionService: GitActionService,
        public gitService: GitService,
        private _gitLogSevice: GitLogService,
        private _loadingService: LoadingService,
    ) {
    }

    switchTab(index: number) {
        const ele = this.switcherRef.nativeElement;
        if (!ele) {
            return;
        }
        TopUI.tab(ele).show(index);
    }

    autoSetSwitcher() {
        const states: GitStatus = this.gitActionService.status;
        if (states.unStaged.length === 0
            && states.staged.length) {
            this.switchTab(1);
        } else {
            this.switchTab(0);
        }
    }

    add() {
        this.loading.add = true;
        this.gitActionService.add()
            .then(() => {
                this.switchTab(1);
                this.loading.add = false;
            })
            .catch(e => {
                this.loading.add = false;
            });
    }

    commit() {
        this.loading.commit = true;
        this.gitActionService.commit(this.message)
            .then(() => {
                return Promise.all([
                    this._gitLogSevice.calcAsyncStatus(),
                    this.gitActionService.init(true),
                ]);
            })
            .then(() => {
                this.switchTab(2);
                this.loading.commit = false;
            })
            .catch(e => {
                this.loading.commit = false;
            });
    }

    push() {
        this._loadingService.setState({
            state: LoadingState.loading,
            message: '代码提交中，请勿刷新页面'
        });
        this.loading.push = true;
        this.gitActionService.push()
            .then(() => {
                return this._gitLogSevice.calcAsyncStatus();
            })
            .then(() => {
                this.loading.push = false;
                this._loadingService.setState({
                    state: LoadingState.success
                });
            })
            .catch(e => {
                this._loadingService.setState({
                    state: LoadingState.fail,
                    message: '代码提交失败',
                });
                this.switchTab(0);
                this.loading.push = false;
                console.error(e);
            });
    }
}
