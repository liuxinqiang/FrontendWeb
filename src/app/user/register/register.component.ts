import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {IUserInfoInterface, IUserInterface} from '../interfaces/user.interface';
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

    registerInfo = this.fb.group({
        token: ['', Validators.required],
        passwords: this.fb.group({
                password: ['', [Validators.required]],
                confirmPassword: ['', [Validators.required]],
            }, {
                validator: this.passwordConfirming,
            }
        ),
    });

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
    ) {
    }

    get f() {
        return this.registerInfo.controls;
    }

    get p() {
        return this.registerInfo.controls.passwords['controls'];
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
        const value = this.registerInfo.value;
        const user: IUserInterface = {
            name: this.userInfo.name,
            avatar: this.userInfo.avatar_url,
            email: this.userInfo.email,
            loginName: this.userInfo.loginName,
            password: value.passwords.password,
            repoPrivateToken: value.token,
            repoUserId: this.userInfo.id,
        };
        this.authService.register(user)
            .subscribe(() => {
                UIkit.notification({
                    message: '注册成功，请登录',
                    status: 'success',
                });
                this.router.navigate(['/user/login'], {
                    queryParams: {
                        loginName: this.userInfo.loginName,
                    }
                }).then();
            });
    }
}
