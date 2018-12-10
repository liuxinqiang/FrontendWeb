import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import {DataFilter, IResponseInterface} from 'app/common/interfaces/response.interface';
import {map} from 'rxjs/internal/operators';
import {Observable} from 'rxjs';
import {IComponentInterface} from '../interfaces/component.interface';

@Injectable({
    providedIn: 'root',
})
export class ComponentsService {

    private _urlPrefix = environment.mainAPI.url + '/asyncComponent';

    constructor(
        private _http: HttpClient,
    ) {
    }

    getComponent(componentName: string): Observable<IComponentInterface> {
        return this._http.get(
            `${this._urlPrefix}/detail`,
            {
                params: {
                    componentName,
                }
            })
            .pipe(
                map((data: IResponseInterface) => data.data)
            );
    }

    existCheck(type, value) {
        return this._http.get(`${this._urlPrefix}/existCheck`, {
            params: {
                type,
                value,
            }
        });
    }

    createComponent(data) {
        return this._http.post(`${this._urlPrefix}/add`, data);
    }

    getAllPublicComponentsList(dataFilter: DataFilter): Observable<object> {
        const {
            pageSize,
            pageIndex,
            keyWord,
            tags,
        } = dataFilter;
        return this._http.post(
            `${this._urlPrefix}/allPublicComponents`,
            {
                pageIndex,
                pageSize,
                keyWord,
                tags,
            });
    }

    getComponentsListByUser(dataFilter: DataFilter, loginName?: string): Observable<object> {
        const {
            pageSize,
            pageIndex,
        } = dataFilter;
        const params = {};
        if (loginName) {
            params['loginName'] = loginName;
        }
        return this._http.post(
            `${this._urlPrefix}/getComponentsByUser`,
            {
                pageIndex,
                pageSize,
            },
            {
                params,
            });
    }
}
