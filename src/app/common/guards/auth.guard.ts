import {Injectable} from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {UserService} from '../../user/services/user.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private _router: Router,
        private _userService: UserService
    ) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this._userService.currentUserValue;
        if (currentUser) {
            return true;
        }
        this._router.navigate(['/user/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
