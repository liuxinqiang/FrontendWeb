import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Md5} from 'ts-md5';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/internal/operators';
import {IUserInterface} from 'src/app/user/interfaces/user.interface';
import {
    ILoginResponseInterface, ILoginUserInterface,
} from 'src/app/common/interfaces/response.interface';
import {Router} from '@angular/router';
import {LocalStorageService} from 'src/app/common/services/local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private userApiPrefix = '/user';

    private currentUserSubject: BehaviorSubject<ILoginUserInterface>;
    public currentUser: Observable<ILoginUserInterface>;

    constructor(
        private http: HttpClient,
        private router: Router,
        private localStorage: LocalStorageService,
    ) {
        this.currentUserSubject = new BehaviorSubject<ILoginUserInterface>(localStorage.getItem('User'));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): ILoginUserInterface {
        return this.currentUserSubject.value;
    }

    private loginSuccess(userInfo: ILoginUserInterface) {
        console.log(userInfo);
        this.localStorage.setItem('User', userInfo);
        this.currentUserSubject.next(userInfo);
    }

    public register(data: IUserInterface) {
        const md5 = new Md5();
        md5.appendStr(data.password);
        data.password = md5.end().toString();
        return this.http.post(`${environment.mainAPI.url}${this.userApiPrefix}/register`, data);
    }

    public simpleUserInfo(username: string) {
        const headers = new HttpHeaders({
            'Skip-Intercept': 'yes',
        });
        return this.http.get(`${environment.mainAPI.url}${this.userApiPrefix}/simpleUserInfo`, {
            headers,
            params: {
                username,
            },
        });
    }

    public login({username, password, rememberMe}): Observable<IUserInterface> {
        const md5 = new Md5();
        md5.appendStr(password);
        password = md5.end().toString();
        return this.http.post(`${environment.mainAPI.url}${this.userApiPrefix}/login`, {
            username,
            password,
            rememberMe,
        })
            .pipe(
                map((res: ILoginResponseInterface) => {
                    this.loginSuccess(res.data);
                    return res.data.user;
                })
            );
    }

    public goToLogin() {
        if (this.router.url.startsWith('/user/login')) {
          return;
        }
        this.localStorage.removeItem('User');
        this.currentUserSubject.next(null);
        this.router.navigate(['/user/login'], {
            queryParams: {
                returnUrl: this.router.url,
            },
        }).then();
    }

    public logout() {
        this.goToLogin();
    }
}
