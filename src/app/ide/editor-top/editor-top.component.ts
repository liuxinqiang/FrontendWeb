import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivityService} from '../services/activity.service';
import PerfectScrollbar from 'perfect-scrollbar';

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
    ) {
    }

    ngAfterViewInit(): void {
        this._scrollBar = new PerfectScrollbar(this.navContainer.nativeElement);
        this.activityService.openedFiles$.asObservable()
            .subscribe(() => {
                this._scrollBar.update();
            });
    }

    ngOnDestroy(): void {
        this._scrollBar.destroy();
        this._scrollBar = null;
    }

}
