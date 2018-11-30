import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';

let lever1Timer, lever2Timer;

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
        if (lever1Timer) {
            clearTimeout(lever1Timer);
        }
        if (lever2Timer) {
            clearTimeout(lever2Timer);
        }
        if (newState.state !== LoadingState.loading) {
            return;
        }
        const message = newState.message;
        lever1Timer = setTimeout(() => {
            newState.message = '任务仍在运行：' + message;
            this._listener.next(newState);
        }, 3000);
        lever2Timer = setTimeout(() => {
            newState.message = '请耐心等待下，任务仍然在运行：' + message;
            this._listener.next(newState);
        }, 10000);
    }
}
