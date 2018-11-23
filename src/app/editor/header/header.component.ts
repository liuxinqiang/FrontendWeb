import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {DomService} from 'app/common/services/dom.service';

@Component({
    selector: 'app-editor-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less']
})
export class EditorHeaderComponent implements OnInit, OnDestroy {

    fullScreenMode = false;

    constructor(
        private _domService: DomService,
    ) {}

    @Input() backUrl = '/';

    ngOnInit() {
    }

    fullScreen() {
        this._domService.enableFullScreen();
        this.fullScreenMode = true;
    }

    exitFullScreen() {
        console.log('run...');
        this._domService.disableFullScreen();
        this.fullScreenMode = false;
    }

    ngOnDestroy(): void {
        this.exitFullScreen();
    }

}
