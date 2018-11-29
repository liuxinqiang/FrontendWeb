import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class LoadingService {

    private _listener: BehaviorSubject<string>;

    constructor() {
        this._listener = new BehaviorSubject('加载中');
    }

    public get state(): string {
        return this._listener.value;
    }

    setState(newState: string) {
        this._listener.next(newState);
    }
}
