import {Component, Input, OnInit} from '@angular/core';
import {DomService} from '../../common/services/dom.service';

@Component({
    selector: 'app-ide-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
    @Input() backUrl = '/';
    fullScreenMode = false;

    headerDropConfig = 'mode: click;offset:11;animation: ui-animation-slide-top-small';

    constructor(
        private _domService: DomService,
    ) {
    }

    ngOnInit() {
    }

    fullScreen() {
        this._domService.enableFullScreen()
            .then(() => {
                this.fullScreenMode = true;
                // this.editorManagerService.layout();
            });
    }

    exitFullScreen() {
        this._domService.disableFullScreen()
            .then(() => {
                this.fullScreenMode = false;
                // this.editorManagerService.layout();
            });
    }

}
