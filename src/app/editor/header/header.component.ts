import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DomService} from 'app/common/services/dom.service';
import {EditorsManagerService} from '../services/editors-manager.service';

@Component({
    selector: 'app-editor-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less']
})
export class EditorHeaderComponent implements OnInit, OnDestroy {

    headerDropConfig = 'mode: click;offset:11;animation: ui-animation-slide-top-small';

    fullScreenMode = false;

    constructor(
        private _domService: DomService,
        public editorManagerService: EditorsManagerService,
    ) {}

    @Input() backUrl = '/';

    ngOnInit() {
    }

    fullScreen() {
        this._domService.enableFullScreen();
        this.fullScreenMode = true;
    }

    exitFullScreen() {
        this._domService.disableFullScreen();
        this.fullScreenMode = false;
    }

    ngOnDestroy(): void {
        this.exitFullScreen();
    }

}
