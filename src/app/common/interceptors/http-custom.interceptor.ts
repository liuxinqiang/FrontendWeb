import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {retry} from 'rxjs/operators';
import {catchError} from 'rxjs/internal/operators';
import {AuthService} from 'src/app/user/services/auth.service';

@Injectable()
export class HttpCustomInterceptor implements HttpInterceptor {

    constructor(
        private _authService: AuthService,
    ) {
    }

    private _handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            UIkit.notification('无网络链接...', {status: 'danger'});
        } else {
            switch (error.error.statusCode) {
                case 401:
                    this._authService.goToLogin();
                    break;
            }
            UIkit.notification(error.error.message, {status: 'danger'});
        }
        return throwError(error);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const currentUser = this._authService.currentUserValue;

        const apiType = request.url.indexOf('git-midea') >= 0 ? 'git' : 'normal';

        if (request.headers.has('Skip-Intercept')) {
            const headers = request.headers.delete('Skip-Intercept');
            const directRequest = request.clone({headers});
            return next.handle(directRequest);
        }

        if (apiType === 'git') {
            if (currentUser
                && currentUser.user
                && currentUser.user.repoPrivateToken) {
                request = request.clone({
                    setHeaders: {
                        'Private-Token': currentUser.user.repoPrivateToken,
                    }
                });
            }
            return next.handle(request);
        } else {
            if (currentUser && currentUser.token) {
                request = request.clone({
                    setHeaders: {
                        'X-Auth-Token': currentUser.token,
                    }
                });
            }
            return next.handle(request)
                .pipe(
                    retry(2),
                    catchError(this._handleError.bind(this))
                );
        }
    }
}
