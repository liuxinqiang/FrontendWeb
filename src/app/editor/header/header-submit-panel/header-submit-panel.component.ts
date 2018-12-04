import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GitService} from '../../services/git.service';
import {GitStatus} from '../../interfaces/git.interface';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-header-submit-panel',
    templateUrl: './header-submit-panel.component.html',
    styleUrls: ['./header-submit-panel.component.less']
})
export class HeaderSubmitPanelComponent implements OnInit, OnDestroy {

    private _switcherSubscription: Subscription;

    @ViewChild('switcher') switcherRef: ElementRef;

    constructor(
        public gitService: GitService,
    ) {
    }

    autoSetSwitcher(states: GitStatus) {
        const ele = this.switcherRef.nativeElement;
        if (!ele) {
            return;
        }
        if (states.unStaged.length === 0
            && states.staged.length) {
            TopUI.tab(ele).show(1);
        } else {
            TopUI.tab(ele).show(0);
        }
    }

    ngOnInit(): void {
        this._switcherSubscription = this.gitService.status$.subscribe(newState => {
            this.autoSetSwitcher(newState);
        });
    }

    ngOnDestroy(): void {
        if (this._switcherSubscription) {
            this._switcherSubscription.unsubscribe();
        }
    }
}
