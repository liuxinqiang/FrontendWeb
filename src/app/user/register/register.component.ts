import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {GitMideaService} from 'app/common/services/git-midea.service';
import {map, switchMap, catchError} from 'rxjs/operators';
import {of, timer} from 'rxjs';
import {IIdentityInterface, IUserInfoInterface, IUserInterface} from '../interfaces/user.interface';
import {animate, style, transition, trigger} from '@angular/animations';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styles: [],
    animations: [
        trigger('userPanel', [
            transition(':enter', [
                style({
                    opacity: 0,
                    height: 0,
                }),
                animate('.3s ease-in-out', style({
                    opacity: 1,
                    height: '*',
                }))
            ]),
            transition(':leave', [
                style({
                    opacity: 1,
                    height: '*',
                }),
                animate('.3s ease-in-out', style({
                    opacity: 0,
                    height: 0,
                }))
            ])
        ])
    ],
})
export class RegisterComponent {

    userInfo: IUserInfoInterface | null = null;

    registerInfo = this._fb.group({
        token: ['', Validators.required, this.validateToken.bind(this)],
        passwords: this._fb.group({
                password: ['', [Validators.required]],
                confirmPassword: ['', [Validators.required]],
            }, {
                validator: this.passwordConfirming,
            }
        ),
    });

    constructor(
        private _fb: FormBuilder,
        private _gitMideaService: GitMideaService,
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

    validateToken(control: AbstractControl) {
        this.userInfo = null;
        return timer(500).pipe(
            switchMap(() => {
                if (!control.value) {
                    return of(null);
                }
                return this._gitMideaService.getUserByPrivateToken(control.value).pipe(
                    map((result: IUserInfoInterface) => {
                        if (!result.loginName) {
                            return {
                                tokenTypeError: true,
                            };
                        } else {
                            this.userInfo = result;
                            return null;
                        }
                    }),
                    catchError(() => of({
                        tokenError: true,
                    }))
                );
            })
        );
    }

    register() {
        const value = this.registerInfo.value;
        const user: IUserInterface = {
            name: this.userInfo.name,
            avatar: this.userInfo.avatar_url,
            email: this.userInfo.email,
            loginName: this.userInfo.loginName,
            password: value.passwords.password,
            authTokens: {
                gitMidea: {
                    token: value.token,
                    id: this.userInfo.id,
                }
            }
        };
        this._authService.register(user)
            .subscribe(() => {
                TopUI.notification({
                    message: '注册成功，请登录',
                    status: 'success',
                });
                this._router.navigate(['/user/login'], {
                    queryParams: {
                        loginName: this.userInfo.loginName,
                    }
                });
            });
    }
}
