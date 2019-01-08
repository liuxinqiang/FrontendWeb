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

    private _urlPrefix = environment.mainAPI.url + '/components';

    constructor(
        private _http: HttpClient,
    ) {
    }

    getComponent(componentId: string): Observable<IComponentInterface> {
        return this._http.get(
            `${this._urlPrefix}/detail`,
            {
                params: {
                    componentId,
                }
            })
            .pipe(
                map((data: IResponseInterface) => data.data)
            );
    }

    componentIdExist(componentId) {
        return this._http.get(`${this._urlPrefix}/component-id-exist`, {
            params: {
                componentId,
            }
        });
    }

    createComponent(data) {
        const formData: FormData = new FormData();
        for (const key in data) {
            if (data.hasOwnProperty(key) && data[key]) {
                if (key === 'uploadFile') {
                    formData.append('file', data[key], data[key].name);
                } else if (['tags', 'isPublic'].indexOf(key) >= 0) {
                    formData.append(key, JSON.stringify(data[key]));
                } else {
                    formData.append(key, data[key]);
                }
            }
        }
        return this._http.post(`${this._urlPrefix}/add`, formData);
    }

    getAllPublicComponentsList(dataFilter: DataFilter): Observable<object> {
        const {
            pageSize,
            pageIndex,
            keyWord,
            tags,
        } = dataFilter;
        return this._http.post(
            `${this._urlPrefix}/all-public-components`,
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
            `${this._urlPrefix}/get-components-by-user`,
            {
                pageIndex,
                pageSize,
            },
            {
                params,
            });
    }
}
