import {Injectable} from '@angular/core';
import {ComponentsService} from '../../components/services/components.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {IComponentInterface} from '../../components/interfaces/component.interface';
import {IEditorQuery} from '../interfaces/files.interface';
import {LoadingService, LoadingState} from './loading.service';

@Injectable()
export class ComponentService {

    private _componentSubject: BehaviorSubject<IComponentInterface | null>;
    public component$: Observable<IComponentInterface | null>;

    public get component(): IComponentInterface | null {
        return this._componentSubject.getValue();
    }

    constructor(
        private _componentsService: ComponentsService,
        private _loadingService: LoadingService,
    ) {
        this._componentSubject = new BehaviorSubject(null);
        this.component$ = this._componentSubject.asObservable();
    }

    async init(query: IEditorQuery): Promise<void> {
        this._loadingService.setState({
            state: LoadingState.loading,
            message: '获取组件信息',
        });
        return new Promise<void>((resolve, reject) => {
            if (query.type === 'component' && query.name) {
                this._componentsService.getComponent(query.name)
                    .toPromise()
                    .then(component => {
                        this._componentSubject.next(component);
                        resolve();
                    })
                    .catch(e => {
                        reject('获取组件信息出错');
                    });
            } else {
                 reject('Url参数错误');
            }
        });
    }
}
