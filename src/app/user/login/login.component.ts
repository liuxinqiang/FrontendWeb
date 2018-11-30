import {Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: []
})
export class LoginComponent {
    readonly _returnUrl: string;

    loginInfo = this._fb.group({
        loginName: ['liuxinqiang', Validators.required],
        password: ['liu566114', Validators.required],
        rememberMe: [false],
    });

    constructor(
        private _fb: FormBuilder,
        private _authService: AuthService,
        private _router: Router,
        private _activeRoute: ActivatedRoute,
    ) {
        this._returnUrl = this._activeRoute.snapshot.queryParams.returnUrl;
    }

    get f() {
        return this.loginInfo.controls;
    }

    login() {
        this._authService.login(this.loginInfo.value)
            .subscribe(() => {
                this._router.navigateByUrl(this._returnUrl || '/projects');
            }, error => {
                this.loginInfo.controls.password.reset();
            });
    }
}
