import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {INavPanelType} from '../interfaces/panel.interface';
@Injectable()
export class EditorService {

    private _activePanelSubject: BehaviorSubject<INavPanelType>;
    public activePanel$: Observable<INavPanelType>;

    constructor() {
        this._activePanelSubject = new BehaviorSubject<INavPanelType>('files');
        this.activePanel$ = this._activePanelSubject.asObservable();
    }

    public get activePanelValue(): INavPanelType {
        return this._activePanelSubject.value;
    }

    changeActivePanel(newPanel: INavPanelType) {
        this._activePanelSubject.next(newPanel);
    }
}
