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

    showContextMenu(event: MouseEvent, menuIndex: number) {
        this._contextMenuService.create({
            top: event.clientY,
            left: event.clientX,
            menus: [
                {
                    type: 'item',
                    label: '关闭全部文件',
                    command: () => this.activityService.closeOpenedFiles(this.activityService.openedFiles),
                },
                {
                    type: 'item',
                    label: '关闭全部其他文件',
                    command: () => this.activityService.closeOpenedFiles(
                        this.activityService.openedFiles.filter(
                            (file, fileIndex) => fileIndex !== menuIndex
                        )),
                },
                {
                    type: 'item',
                    label: '关闭全部右边文件',
                    command: () => this.activityService.closeOpenedFiles(
                        this.activityService.openedFiles.filter(
                            (file, fileIndex) => fileIndex > menuIndex
                        )),
                },
                {
                    type: 'item',
                    label: '关闭全部左边文件',
                    command: () => this.activityService.closeOpenedFiles(
                        this.activityService.openedFiles.filter(
                            (file, fileIndex) => fileIndex < menuIndex
                        )),
                },
            ]
        }, event);
    }
}
