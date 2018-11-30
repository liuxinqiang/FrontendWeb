import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import {AuthService} from 'app/user/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class GitMideaService {
    private urlPrefix = environment.gitMidea.url + '/api/v4';

    constructor(
        private _http: HttpClient,
        private _authService: AuthService,
    ) {
    }

    createProject() {
        return this._http.post(this.urlPrefix + '/projects', {
            name: '测试项目1',
            path: 'test1',
            description: '从浏览器创建的本地项目1',
        });
    }

    getProjectsList() {
        return this._http.get(this.urlPrefix + '/users/' + this._authService.currentUserValue.user.authTokens.gitMidea.id + '/projects');
    }
    // user
    users() {
        return this._http.get(this.urlPrefix + '/users');
    }

    user() {
        return this._http.get(this.urlPrefix + '/user');
    }

    groups() {
        return this._http.get(this.urlPrefix + '/groups');
    }
}
