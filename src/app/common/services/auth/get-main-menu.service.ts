import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Route, Router} from '@angular/router';
import {IMainMenuInterface} from '../../interfaces/menu.interface';
import {Observable} from 'rxjs';
import {map} from 'rxjs/internal/operators';
import {ILoginUserInterface} from '../../interfaces/response.interface';

function filterManiMenu(routes: Route[]): IMainMenuInterface[] {
    const result = [];
    routes.forEach(route => {
        if (route.data && route.data.mainMenu) {
            result.push(Object.assign({}, route.data.mainMenu));
        }
    });
    return result;
}

function transfer(menus: IMainMenuInterface[],
                  result = [],
                  userRule: number) {
    menus.forEach((menu: IMainMenuInterface) => {
        if (userRule >= menu.rule) {
            const newMenu: IMainMenuInterface = Object.assign({}, menu);
            newMenu.children = [];
            if (menu.children && menu.children.length) {
                transfer(menu.children,
                    newMenu.children,
                    userRule);
            }
            result.push(newMenu);
        }
    });
    return result;
}

function searchMenu(menus: IMainMenuInterface[], keyPath: String): IMainMenuInterface {
    let result = null;
    menus.forEach((menu: IMainMenuInterface) => {
        if (!result && menu.path === keyPath) {
            result = Object.assign({}, menu);
        } else if (!result && menu.children) {
            result = searchMenu(menu.children, keyPath);
        }
    });
    return result;
}

@Injectable({
    providedIn: 'root'
})
export class GetMainMenuService {
    constructor(
        private _authService: AuthService,
        private _router: Router,
    ) {
    }

    getMainMenu(searchPath?: string): Observable<{ menus: IMainMenuInterface[], menu: IMainMenuInterface, user: ILoginUserInterface }> {
        return this._authService.currentUser.pipe(
            map(user => {
                const filterMenus: IMainMenuInterface[] = filterManiMenu(this._router.config);
                let menu: null | IMainMenuInterface = null;
                const menus = transfer(
                    filterMenus,
                    [],
                    user ? user.user.rule : 0);
                if (searchPath) {
                    menu = searchMenu(menus, searchPath);
                }
                return {
                    menus,
                    menu,
                    user,
                };
            })
        );
    }
}
