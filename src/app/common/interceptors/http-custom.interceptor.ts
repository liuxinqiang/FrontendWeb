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
import {AuthService} from '../services/auth/auth.service';

@Injectable()
export class HttpCustomInterceptor implements HttpInterceptor {

    constructor(
        private _authService: AuthService,
        ) {}

    private _handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            TopUI.notification('无网络链接...', {status: 'danger'});
        } else {
            switch(error.error.statusCode) {
                case 401:
                    this._authService.goToLogin();
                    break;
            }
            TopUI.notification(error.error.message, {status: 'danger'});
        }
        return throwError(error);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentUser = this._authService.currentUserValue;
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
