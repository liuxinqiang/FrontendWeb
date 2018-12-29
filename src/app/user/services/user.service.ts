import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from 'environments/environment';
import {Md5} from 'ts-md5';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/internal/operators';
import {IUserInterface} from 'app/user/interfaces/user.interface';
import {
    ILoginResponseInterface, ILoginUserInterface, IResponseInterface,
} from 'app/common/interfaces/response.interface';
import {Router} from '@angular/router';
import {LocalStorageService} from 'app/common/services/local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private _userApiPrefix = '/user';

    private currentUserSubject: BehaviorSubject<ILoginUserInterface>;
    public currentUser: Observable<ILoginUserInterface>;

    constructor(
        private _http: HttpClient,
        private _router: Router,
        private _localStorage: LocalStorageService,
    ) {
        this.currentUserSubject = new BehaviorSubject<ILoginUserInterface>(_localStorage.getItem('User'));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): ILoginUserInterface {
        return this.currentUserSubject.value;
    }

    private loginSuccess(userInfo: ILoginUserInterface) {
        this._localStorage.setItem('User', userInfo);
        this.currentUserSubject.next(userInfo);
    }

    public register(data: IUserInterface) {
        const md5 = new Md5();
        md5.appendStr(data.password);
        data.password = md5.end().toString();
        return this._http.post(`${environment.mainAPI.url}${this._userApiPrefix}/register`, data);
    }

    public userInfo(loginName: string): Observable<IUserInterface | null> {
        return this._http.get(`${environment.mainAPI.url}${this._userApiPrefix}/user-info`, {
            params: {
                loginName,
            },
        })
            .pipe(
                map((res: IResponseInterface) => res.data),
            );
    }

    public login({loginName, password, rememberMe}): Observable<IUserInterface> {
        const md5 = new Md5();
        md5.appendStr(password);
        password = md5.end().toString();
        return this._http.post(`${environment.mainAPI.url}${this._userApiPrefix}/login`, {
            loginName,
            password,
            rememberMe,
        })
            .pipe(
                map((res: ILoginResponseInterface) => {
                    res.data.user.rule = 1;
                    this.loginSuccess(res.data);
                    return res.data.user;
                })
            );
    }

    public goToLogin() {
        this._localStorage.removeItem('User');
        this.currentUserSubject.next(null);
        this._router.navigate(['/user/login'], {
            queryParams: {
                returnUrl: this._router.url,
            },
        }).then();
    }

    public updateUser(user: IUserInterface) {
        delete user.loginName;
        if (user.password) {
            const md5 = new Md5();
            md5.appendStr(user.password);
            user.password = md5.end().toString();
        }
        return this._http.post(`${environment.mainAPI.url}${this._userApiPrefix}/update`, user)
            .pipe(
                map((res: IResponseInterface) => res.data),
            );
    }

    public getUserAvailableTokens() {
        return this._http.get(`${environment.mainAPI.url}${this._userApiPrefix}/get-available-tokens`)
            .pipe(
                map((res: IResponseInterface) => res.data),
            );
    }

    public logout() {
        this.goToLogin();
    }
}
