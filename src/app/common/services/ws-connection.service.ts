import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {webSocket} from 'rxjs/webSocket';
import {AuthService} from 'app/user/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class WsConnectionService {

    private _ws$;

    constructor(private _authService: AuthService) {}

    getConnection() {
        if (!this._ws$) {
            this._ws$ = webSocket({
                // tslint:disable:max-line-length
                url: `${environment.builder.url}?token=${this._authService.currentUserValue ? this._authService.currentUserValue.token : ''}`,
                // tslint:enable:max-line-length
            });
        }
        return this._ws$;
    }

    disConnection() {
        this._ws$.unsubscribe();
        this._ws$ = null;
    }

    public get connection() {
        return this.getConnection();
    }
}