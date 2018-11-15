import {Component, OnDestroy} from '@angular/core';
import {GetMainMenuService} from 'app/common/services/auth/get-main-menu.service';
import {Subscription} from 'rxjs';
import {IMainMenuInterface} from 'app/common/interfaces/menu.interface';

@Component({
    selector: 'app-components-home',
    templateUrl: './home.component.html',
    styles: []
})
export class HomeComponent implements OnDestroy {
    private _getMainMenuSubscription$: Subscription;
    menu: IMainMenuInterface;

    constructor(private _getMainMenuService: GetMainMenuService) {
        this._getMainMenuSubscription$ = this._getMainMenuService.getMainMenu('/components')
            .subscribe(data => {
                this.menu = data.menu;
            });
    }

    ngOnDestroy() {
        this._getMainMenuSubscription$.unsubscribe();
    }
}
