import {Component, OnDestroy, OnInit} from '@angular/core';
import {GetMainMenuService} from 'app/common/services/auth/get-main-menu.service';
import {Subscription} from 'rxjs';
import {IMainMenuInterface} from 'app/common/interfaces/menu.interface';
import {Title} from '@angular/platform-browser';

@Component({
    selector: 'app-components-home',
    templateUrl: './entry.component.html',
    styles: []
})
export class EntryComponent implements OnDestroy, OnInit {
    private _getMainMenuSubscription$: Subscription;
    menu: IMainMenuInterface;

    constructor(
        private _getMainMenuService: GetMainMenuService,
        private _title: Title,
    ) {
        this._getMainMenuSubscription$ = this._getMainMenuService.getMainMenu('/components')
            .subscribe(data => {
                this.menu = data.menu;
            });
    }

    ngOnDestroy() {
        this._getMainMenuSubscription$.unsubscribe();
    }

    ngOnInit() {
        this._title.setTitle('组件库');
    }
}
