import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IWSMessageInterface} from 'app/common/interfaces/websocket.interface';
import {map} from 'rxjs/internal/operators';
import {IResponseInterface} from '../../common/interfaces/response.interface';
import {WsConnectionService} from '../../common/services/ws/ws-connection.service';

@Injectable()
export class BuildService {

    constructor(private _wsConnection: WsConnectionService) {
    }

    onMessage(): Observable<any> {
        return this._wsConnection.connection.pipe(
            map((res: IResponseInterface) => res.data),
        );
    }

    disConnect() {
        this._wsConnection.disConnection();
    }

    sendMessage(message: IWSMessageInterface) {
        this._wsConnection.connection.next(message);
    }

}
