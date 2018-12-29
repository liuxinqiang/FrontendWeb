import {Component, ElementRef, ViewChild, AfterViewInit, Inject, OnDestroy} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {ILoginUserInterface} from 'app/common/interfaces/response.interface';
import {Subscription} from 'rxjs';
import {IMainMenuInterface} from '../../interfaces/menu.interface';
import {GetMainMenuService} from '../services/get-main-menu.service';
import {UserService} from 'app/user/services/user.service';
import {DomService} from '../../services/dom.service';

@Component({
    selector: 'app-common-main-menu',
    templateUrl: './main-menu.component.html',
    styles: []
})
export class MainMenuComponent implements AfterViewInit, OnDestroy {

    enableSearch = false;

    currentUser: ILoginUserInterface;
    mainMenus: IMainMenuInterface[];

    private _mainMenuSubscription$: Subscription;

    constructor(
        private _domService: DomService,
        private _mainMenuService: GetMainMenuService,
        private _userService: UserService,
    ) {
        this._mainMenuSubscription$ = this._mainMenuService.getMainMenu()
            .subscribe((data: {menus: IMainMenuInterface[], user: ILoginUserInterface}) => {
               this.mainMenus = data.menus;
               this.currentUser = data.user;
            });
    }

    @ViewChild('searchButton') searchButton: ElementRef;

    ngAfterViewInit() {
        if (this._domService.isBrowser && this.enableSearch) {
            setTimeout(() => {
                TopUI.toggle(this.searchButton.nativeElement).toggle();
            }, 0);
        }
    }

    ngOnDestroy(): void {
        this._mainMenuSubscription$.unsubscribe();
    }

    goToLogin() {
        this._userService.goToLogin();
    }

    logOut() {
        this._userService.logout();
    }
}
