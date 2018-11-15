import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {IResponseInterface} from 'app/common/interfaces/response.interface';
import {map} from 'rxjs/internal/operators';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ITag} from '../interfaces/tag.interface';

@Injectable()
export class TagsService {
    private _urlPrefix = '/asyncComponent/tag';

    constructor(
        private _http: HttpClient,
    ) {}

    getTags(): Observable<ITag[]> {
        return this._http.get(
            `${environment.mainAPI.url}${this._urlPrefix}/all`)
            .pipe(
                map((data: IResponseInterface) => data.data)
            );
    }
}
