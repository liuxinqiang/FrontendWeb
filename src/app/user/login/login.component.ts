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
    readonly returnUrl: string;

    userInfo: null | IUserInterface = null;

    loginInfo = this.fb.group({
        username: ['', [
            Validators.required,
            Validators.minLength(4)
        ], this.validateUsername.bind(this)],
        password: ['', Validators.required],
        rememberMe: [false],
    });

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private activeRoute: ActivatedRoute,
    ) {
        this.returnUrl = this.activeRoute.snapshot.queryParams.returnUrl;
        if (this.activeRoute.snapshot.queryParams.username) {
            this.f.username.setValue(this.activeRoute.snapshot.queryParams.username);
        }
    }

    get f() {
        return this.loginInfo.controls;
    }

    validateUsername(control: AbstractControl) {
        this.userInfo = null;
        return timer(500).pipe(
            switchMap(() => {
                if (!control.value) {
                    return of(null);
                }
                return this.authService.simpleUserInfo(control.value).pipe(
                    map((result: IUserInterface) => {
                        this.userInfo = result;
                        return null;
                    }),
                    catchError(() => of({
                        notExist: control.value,
                    }))
                );
            })
        );
    }

    login() {
        this.authService.login(this.loginInfo.value)
            .subscribe(() => {
                this.router.navigateByUrl(this.returnUrl || '/components');
            }, error => {
                this.loginInfo.controls.password.reset();
            });
    }
}
