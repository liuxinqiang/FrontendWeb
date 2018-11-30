import {Injectable} from '@angular/core';
import {ComponentsService} from '../../components/services/components.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {IComponentInterface} from '../../components/interfaces/component.interface';
import {IEditorQuery} from '../interfaces/files.interface';
import {LoadingService} from './loading.service';

@Injectable()
export class ComponentService {

    private _componentInfoSubject: BehaviorSubject<IComponentInterface | null>;
    private _componentInfo$: Observable<IComponentInterface | null>;

    public get componentInfo(): IComponentInterface | null {
        return this._componentInfoSubject.getValue();
    }

    constructor(
        private _componentsService: ComponentsService,
        private _loadingService: LoadingService,
    ) {
        this._componentInfoSubject = new BehaviorSubject(null);
        this._componentInfo$ = this._componentInfoSubject.asObservable();
    }

    async init(query: IEditorQuery) {
        this._loadingService.setState('获取组件信息');
        console.log('query');
        console.log(query);
        if (query.type === 'component' && query.name) {
            console.log('123');
            return this._componentsService.getComponent(query.name)
                .toPromise()
                .then(component => {
                    this._componentInfoSubject.next(component);
                    return component;
                });
        } else {
            return Promise.reject(null);
        }
    }
}
