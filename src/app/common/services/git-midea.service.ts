import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'environments/environment';
import {AuthService} from 'app/user/services/auth.service';
import {Observable} from 'rxjs';
import {IUserInfoInterface} from '../../user/interfaces/user.interface';
import {map} from 'rxjs/operators';

function calcUserLoginName(user: IUserInfoInterface) {
    const keyStr = 'uid=';
    if (!user || !user.identities) {
        return user;
    }
    const ldap = user.identities.filter(identity => identity.provider === 'ldapmain')[0];
    if (ldap && ldap.extern_uid.indexOf('uid=') >= 0) {
        const strings = ldap.extern_uid.split(',');
        const uid = strings.filter(string => string.indexOf(keyStr) >= 0)[0];
        user.loginName = uid.substr(keyStr.length);
    }
    return user;
}

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

    createProject(data) {
        return this._http.post(this.urlPrefix + '/projects', data)
            .toPromise();
    }

    getRootProjectsList() {
        return this._http.get(this.urlPrefix + '/users/' + this._authService.currentUserValue.user.authTokens.gitMidea.id + '/projects');
    }

    getProjectsByGroup(groupId: string) {
        return this._http.get(this.urlPrefix + '/groups/' + groupId + '/projects');
    }

    // user
    users() {
        return this._http.get(this.urlPrefix + '/users');
    }

    user(): Promise<any> {
        return this._http.get(this.urlPrefix + '/user')
            .pipe(
                map((result: IUserInfoInterface) => calcUserLoginName(result))
            )
            .toPromise();
    }

    getUserByPrivateToken(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Private-Token': token,
            'Skip-Intercept': 'yes',
        });
        return this._http.get(this.urlPrefix + '/user', {
            headers,
        })
            .pipe(
                map((result: IUserInfoInterface) => calcUserLoginName(result))
            );
    }

    projectGroups() {
        return this._http.get(this.urlPrefix + '/groups');
    }

    getCommits(projectId, branch?: string, since?: string): Promise<object> {
        const params = {};
        if (branch) {
            params['ref_name'] = branch;
        }
        if (since) {
            params['since'] = since;
        }
        return this._http.get(this.urlPrefix + '/projects/' + projectId + '/repository/commits', {
            params,
        })
            .toPromise();
    }
}
