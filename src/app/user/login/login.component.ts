import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {of, timer} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {IUserInterface} from '../interfaces/user.interface';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: []
})
export class LoginComponent {
    readonly _returnUrl: string;

    userInfo: null | IUserInterface = null;

    loginInfo = this._fb.group({
        loginName: ['', [
            Validators.required,
            Validators.minLength(4)
        ], this.validateLoginName.bind(this)],
        password: ['', Validators.required],
        rememberMe: [false],
    });

    constructor(
        private _fb: FormBuilder,
        private _authService: AuthService,
        private _router: Router,
        private _activeRoute: ActivatedRoute,
    ) {
        this._returnUrl = this._activeRoute.snapshot.queryParams.returnUrl;
        if (this._activeRoute.snapshot.queryParams.loginName) {
            this.f.loginName.setValue(this._activeRoute.snapshot.queryParams.loginName);
        }
    }

    get f() {
        return this.loginInfo.controls;
    }

    validateLoginName(control: AbstractControl) {
        this.userInfo = null;
        return timer(500).pipe(
            switchMap(() => {
                if (!control.value) {
                    return of(null);
                }
                return this._authService.userInfo(control.value).pipe(
                    map((result: IUserInterface | null) => {
                        if (result === null) {
                            return {
                                'notExist': control.value,
                            };
                        } else {
                            this.userInfo = result;
                            return null;
                        }
                    }),
                    catchError(() => of({
                        'notExist': control.value,
                    }))
                );
            })
        );
    }

    login() {
        this._authService.login(this.loginInfo.value)
            .subscribe(() => {
                this._router.navigateByUrl(this._returnUrl || '/components').then();
            }, () => {
                this.loginInfo.controls.password.reset();
            });
    }
}
