import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DomService} from 'app/common/services/dom.service';
import {EditorsManagerService} from '../services/editors-manager.service';
import {ComponentService} from '../services/component.service';
import {GitService} from '../services/git.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {GitActionService} from '../services/git-action.service';

@Component({
    selector: 'app-editor-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less'],
    animations: [
        trigger('counter', [
            transition(':enter', [
                style({
                    transform: 'scale(0)',
                }),
                animate('.3s ease-in-out', style({
                    transform: 'scale(.7)',
                }))
            ]),
            transition(':leave', [
                style({
                    transform: 'scale(.7)',
                }),
                animate('.3s ease-in-out', style({
                    transform: 'scale(0)',
                }))
            ])
        ])
    ],
})
export class EditorHeaderComponent implements OnInit, OnDestroy {

    headerDropConfig = 'mode: click;offset:11;animation: ui-animation-slide-top-small';

    fullScreenMode = false;

    constructor(
        private _domService: DomService,
        public editorManagerService: EditorsManagerService,
        public componentService: ComponentService,
        public gitActionService: GitActionService,
    ) {
    }

    @Input() backUrl = '/';

    fullScreen() {
        this._domService.enableFullScreen();
        this.fullScreenMode = true;
        setTimeout(() => {
            this.editorManagerService.layout();
        }, 100);
    }

    exitFullScreen() {
        this._domService.disableFullScreen();
        this.fullScreenMode = false;
        setTimeout(() => {
            this.editorManagerService.layout();
        }, 100);
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.exitFullScreen();
    }

}
