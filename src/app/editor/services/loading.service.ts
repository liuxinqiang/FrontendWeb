import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export enum LoadingState {
    loading = 'LOADING',
    fail = 'FAIL',
    success = 'SUCCESS',
}

export interface ILoading {
    state: LoadingState;
    message?: string;
}

@Injectable()
export class LoadingService {

    private _listener: BehaviorSubject<ILoading>;

    constructor() {
        this._listener = new BehaviorSubject({
            state: LoadingState.loading,
            message: '加载中',
        });
    }

    public get state(): ILoading {
        return this._listener.value;
    }

    setState(newState: ILoading) {
        this._listener.next(newState);
    }
}
