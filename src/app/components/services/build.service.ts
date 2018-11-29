import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IWSMessageInterface} from 'app/common/interfaces/websocket.interface';
import {filter, map, retry} from 'rxjs/internal/operators';
import {WsConnectionService} from 'app/common/services/ws-connection.service';

@Injectable()
export class BuildService {

    constructor(private _wsConnection: WsConnectionService) {
    }

    onMessage(): Observable<any> {
        return this._wsConnection.connection.pipe(
            filter((res: IWSMessageInterface) => res.event === 'builder'),
            map((res: IWSMessageInterface) => res.data),
            retry()
        );
    }

    disConnect() {
        this._wsConnection.disConnection();
    }

    sendMessage(data: any) {
        this._wsConnection.connection.next({
            event: 'builder',
            data,
        });
    }
}
