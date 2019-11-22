import {Component, ElementRef, ViewChild, AfterViewInit, Inject, OnDestroy} from '@angular/core';
import {ILoginUserInterface} from 'src/app/common/interfaces/response.interface';
import {Subscription} from 'rxjs';
import {IMainMenuInterface} from '../../interfaces/menu.interface';
import {GetMainMenuService} from '../services/get-main-menu.service';
import {AuthService} from 'src/app/user/services/auth.service';
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

    private mainMenuSubscription$: Subscription;

    constructor(
        private domService: DomService,
        private mainMenuService: GetMainMenuService,
        private authService: AuthService,
    ) {
        this.mainMenuSubscription$ = this.mainMenuService.getMainMenu()
            .subscribe((data: {menus: IMainMenuInterface[], user: ILoginUserInterface}) => {
               this.mainMenus = data.menus;
               this.currentUser = data.user;
            });
    }

    @ViewChild('searchButton', {
      static: false,
    }) searchButton: ElementRef;

    ngAfterViewInit() {
        if (this.domService.isBrowser && this.enableSearch) {
            setTimeout(() => {
                UIkit.toggle(this.searchButton.nativeElement).toggle();
            }, 0);
        }
    }

    ngOnDestroy(): void {
        this.mainMenuSubscription$.unsubscribe();
    }

    goToLogin() {
        this.authService.goToLogin();
    }

    logOut() {
        this.authService.logout();
    }
}
