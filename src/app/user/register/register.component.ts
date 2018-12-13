import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {IUserInterface} from '../interfaces/user.interface';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {of, timer} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styles: [],
})
export class RegisterComponent {
    registerInfo = this._fb.group({
        name: ['', Validators.required],
        loginName: [
            '',
            [
                Validators.required,
                Validators.pattern(/^[0-9a-zA-Z]{4,20}$/),
            ],
            this.validateLoginNameExist.bind(this),
        ],
        passwords: this._fb.group({
                password: [
                    '', [
                        Validators.required,
                        Validators.pattern(/^[0-9a-zA-Z]{6,20}$/),
                    ]
                ],
                confirmPassword: [
                    '', [
                        Validators.required
                    ]
                ],
            }, {
                validator: this.passwordConfirming,
            }
        ),
        email: ['',
            [
                Validators.required,
                Validators.email,
            ]
        ],
        phone: [
            '',
            [
                Validators.required,
                Validators.pattern(/^1[34578]\d{9}$/),
            ],
        ],
        avatar: [
            '',
        ],
    });

    constructor(
        private _fb: FormBuilder,
        private _authService: AuthService,
        private _router: Router,
    ) {
    }

    get f() {
        return this.registerInfo.controls;
    }

    get p() {
        return this.registerInfo['controls'].passwords['controls'];
    }

    validateLoginNameExist(control: AbstractControl) {
        return timer(500).pipe(
            switchMap(() => {
                if (!control.value) {
                    return of(null);
                }
                return this._authService.userInfo(control.value).pipe(
                    map((result: IUserInterface | null) => {
                        if (result === null) {
                            return null;
                        } else {
                            return {
                                'exist': result.name,
                            };
                        }
                    }),
                    catchError(() => of({
                        'exist': control.value,
                    }))
                );
            })
        );
    }

    getConfirmPasswordError() {
        return this.p.password.touched
            && this.p.confirmPassword.touched
            && !this.p.confirmPassword.errors
            && this.f.passwords.hasError('notMatch');
    }

    passwordConfirming(c: AbstractControl): { notMatch: boolean } {
        if (c.get('password').value !== c.get('confirmPassword').value) {
            return {notMatch: true};
        }
    }

    register() {
        const value: IUserInterface = this.registerInfo.value;
        this._authService.register(value)
            .subscribe(() => {
                TopUI.notification({
                    message: '注册成功，请登录',
                    status: 'success',
                });
                this._router.navigate(['/user/login'], {
                    queryParams: {
                        loginName: value.loginName,
                    }
                }).then();
            });
    }
}
