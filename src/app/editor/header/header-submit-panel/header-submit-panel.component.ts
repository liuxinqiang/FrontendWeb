import {Component, OnInit} from '@angular/core';
import {GitService} from '../../services/git.service';

@Component({
    selector: 'app-header-submit-panel',
    templateUrl: './header-submit-panel.component.html',
    styleUrls: ['./header-submit-panel.component.less']
})
export class HeaderSubmitPanelComponent implements OnInit {

    constructor(
        public gitService: GitService,
    ) {
    }

    ngOnInit() {

    }

}
