import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivityService} from '../services/activity.service';
import PerfectScrollbar from 'perfect-scrollbar';
import {ContextMenuService} from '../services/context-menu.service';

@Component({
    selector: 'app-ide-editor-top',
    templateUrl: './editor-top.component.html',
    styleUrls: ['./editor-top.component.less']
})
export class EditorTopComponent implements AfterViewInit, OnDestroy {

    private _scrollBar;

    @ViewChild('navContainer') navContainer: ElementRef;

    constructor(
        public activityService: ActivityService,
        private _contextMenuService: ContextMenuService,
    ) {
    }

    ngAfterViewInit(): void {
        this._scrollBar = new PerfectScrollbar(this.navContainer.nativeElement);
        this.activityService.openedFiles$
            .subscribe(() => {
                if (this._scrollBar) {
                    this._scrollBar.update();
                }
            });
    }

    ngOnDestroy(): void {
        this._scrollBar.destroy();
        this._scrollBar = null;
    }

    showContextMenu(event: MouseEvent) {
        this._contextMenuService.create({
            top: event.clientY,
            left: event.clientX,
            menus: [
                {
                    type: 'item',
                    icon: 'camera',
                    label: '复制',
                    key: '⌘C',
                },
                {
                    type: 'line',
                },
                {
                    type: 'item',
                    label: '粘贴',
                    key: '⌘V',
                },
            ]
        });
        event.preventDefault();
        event.stopPropagation();
    }
}
