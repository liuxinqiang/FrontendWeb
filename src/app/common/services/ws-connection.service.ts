import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {webSocket} from 'rxjs/webSocket';
import {AuthService} from 'src/app/user/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class WsConnectionService {

    private ws$;

    constructor(private authService: AuthService) {}

    getConnection() {
        if (!this.ws$) {
            this.ws$ = webSocket({
                url: `${environment.liveAPI.url}?token=${this.authService.currentUserValue ? this.authService.currentUserValue.token : ''}`,
            });
        }
        return this.ws$;
    }

    disConnection() {
        this.ws$.unsubscribe();
        this.ws$ = null;
    }

    public get connection() {
        return this.getConnection();
    }
}
