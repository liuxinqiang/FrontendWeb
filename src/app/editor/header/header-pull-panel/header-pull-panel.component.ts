import {Component} from '@angular/core';
import {GitActionService} from '../../services/git-action.service';
import {GitLogService} from '../../services/git-log.service';
import {LoadingService, LoadingState} from '../../services/loading.service';

@Component({
    selector: 'app-header-pull-panel',
    templateUrl: './header-pull-panel.component.html',
    styleUrls: ['./header-pull-panel.component.less']
})
export class HeaderPullPanelComponent {

    constructor(
        private _loadingService: LoadingService,
        public gitActionService: GitActionService,
        private _gitLogService: GitLogService,
    ) {
    }

    pull() {
        this._loadingService.setState({
            state: LoadingState.loading,
            message: '正在更新代码，请不要刷新页面'
        });
        this.gitActionService.pull()
            .then((data) => {
                return this._gitLogService.calcAsyncStatus();
            })
            .then(() => {
                this._loadingService.setState({
                    state: LoadingState.success
                });
            });
    }

}
