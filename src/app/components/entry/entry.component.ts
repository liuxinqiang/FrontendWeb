import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {IMainMenuInterface} from 'app/common/interfaces/menu.interface';
import {GetMainMenuService} from 'app/common/components/services/get-main-menu.service';

@Component({
    selector: 'app-components-home',
    templateUrl: './entry.component.html',
    styles: []
})
export class EntryComponent implements OnDestroy {
    private _getMainMenuSubscription$: Subscription;
    menu: IMainMenuInterface;

    constructor(
        private _getMainMenuService: GetMainMenuService,
    ) {
        this._getMainMenuSubscription$ = this._getMainMenuService.getMainMenu('/components')
            .subscribe(data => {
                this.menu = data.menu;
            });
    }

    ngOnDestroy() {
        this._getMainMenuSubscription$.unsubscribe();
    }
}
