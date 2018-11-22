import {Component, ElementRef, ViewChild, AfterViewInit, Inject, OnDestroy} from '@angular/core';
import {PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {ILoginUserInterface} from 'app/common/interfaces/response.interface';
import {Subscription} from 'rxjs';
import {IMainMenuInterface} from '../../interfaces/menu.interface';
import {GetMainMenuService} from '../../services/auth/get-main-menu.service';
import {AuthService} from '../../services/auth/auth.service';

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
        @Inject(PLATFORM_ID) private _platformId: Object,
        private _mainMenuService: GetMainMenuService,
        private _authService: AuthService,
    ) {
        this._mainMenuSubscription$ = this._mainMenuService.getMainMenu()
            .subscribe((data: {menus: IMainMenuInterface[], user: ILoginUserInterface}) => {
               this.mainMenus = data.menus;
               this.currentUser = data.user;
            });
    }

    @ViewChild('searchButton') searchButton: ElementRef;

    ngAfterViewInit() {
        if (isPlatformBrowser(this._platformId) && this.enableSearch) {
            setTimeout(() => {
                TopUI.toggle(this.searchButton.nativeElement).toggle();
            }, 0);
        }
    }

    ngOnDestroy(): void {
        this._mainMenuSubscription$.unsubscribe();
    }

    goToLogin() {
        this._authService.goToLogin();
    }

    logOut() {
        this._authService.logout();
    }
}