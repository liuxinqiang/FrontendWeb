import {Injectable} from '@angular/core';
import {webSocket} from 'rxjs/webSocket';
import {environment} from 'environments/environment';
import {Observable} from 'rxjs';
import {IWSMessageInterface} from 'app/common/interfaces/websocket.interface';
import {map} from 'rxjs/internal/operators';
import {AuthService} from '../../common/services/auth/auth.service';
import {IResponseInterface} from '../../common/interfaces/response.interface';

@Injectable()
export class BuildService {

    constructor(private _authService: AuthService) {
    }

    private _builder$ = webSocket({
        url: `${environment.builder.url}?token=${this._authService.currentUserValue ? this._authService.currentUserValue.token : ''}`,
    });

    onMessage(): Observable<any> {
        return this._builder$.pipe(
            map((res: IResponseInterface) => res.data),
        );
    }

    disConnect() {
        this._builder$.unsubscribe();
    }

    sendMessage(message: IWSMessageInterface) {
        this._builder$.next(message);
    }

}
