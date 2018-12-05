import {Component, OnInit} from '@angular/core';
import {GitActionService} from '../../services/git-action.service';
import {GitLogService} from '../../services/git-log.service';

@Component({
    selector: 'app-header-pull-panel',
    templateUrl: './header-pull-panel.component.html',
    styleUrls: ['./header-pull-panel.component.less']
})
export class HeaderPullPanelComponent implements OnInit {

    constructor(
        public gitActionService: GitActionService,
        private _gitLogSevice: GitLogService,
    ) {
    }

    pull() {
        this.gitActionService.pull()
            .then((data) => {
                console.log('获取成功');
                console.log(data);
                return this._gitLogSevice.calcAsyncStatus();
            })
            .then(() => {
                console.log('获取成功');
            });
    }

    ngOnInit() {
    }

}
