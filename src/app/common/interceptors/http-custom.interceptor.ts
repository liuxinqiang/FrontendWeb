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
        private authService: AuthService,
    ) {
    }

    private _handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            UIkit.notification('无网络链接...', {status: 'danger'});
        } else {
            if (error.error.statusCode === 401) {
              error.error.message = '用户验证失败';
              this.authService.goToLogin();
            }
            UIkit.notification(error.error.message, {status: 'danger'});
        }
        return throwError(error);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const currentUser = this.authService.currentUserValue;

        if (request.headers.has('Skip-Intercept')) {
            const headers = request.headers.delete('Skip-Intercept');
            const directRequest = request.clone({headers});
            return next.handle(directRequest);
        }
        if (currentUser && currentUser.access_token) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + currentUser.access_token,
                }
            });
        }
        return next.handle(request)
            .pipe(
                retry(1),
                catchError(this._handleError.bind(this))
            );
    }
}
