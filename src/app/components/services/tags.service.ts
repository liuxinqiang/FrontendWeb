import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {IResponseInterface} from 'app/common/interfaces/response.interface';
import {map} from 'rxjs/internal/operators';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {ITag, ITagSimple} from '../interfaces/tag.interface';

@Injectable()
export class TagsService {
    private _tagsSubject: BehaviorSubject<ITag[]>;
    public tags$: Observable<ITag[]>;
    private _urlPrefix = environment.mainAPI.url + '/components/tag';

    public get tags(): ITag[] {
        return this._tagsSubject.getValue();
    }

    constructor(
        private _http: HttpClient,
    ) {
        this._tagsSubject = new BehaviorSubject<ITag[]>([]);
        this.tags$ = this._tagsSubject.asObservable();
        this.getTags().subscribe(data => {
            this._tagsSubject.next(data);
        });
    }

    getTags(): Observable<ITag[]> {
        return this._http.get(`${this._urlPrefix}/all`)
            .pipe(
                map((data: IResponseInterface) => {
                    return data.data;
                })
            );
    }

    addTag(name, parent?): Observable<ITagSimple> {
        const tagData = {
            name,
        };
        if (parent) {
            tagData['parent'] = parent;
        }
        return this._http.post(`${this._urlPrefix}/add`, tagData)
            .pipe(
                map((data: IResponseInterface): ITagSimple => {
                    return data.data;
                })
            );
    }
}
