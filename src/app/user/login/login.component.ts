import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from 'app/common/services/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: []
})
export class LoginComponent implements OnInit {
    readonly _returnUrl: string;

    loginInfo = this._fb.group({
        loginName: ['liuxinqiang', Validators.required],
        password: ['liu566114', Validators.required],
        rememberMe: [false],
    });

    constructor(
        private _title: Title,
        private _fb: FormBuilder,
        private _authService: AuthService,
        private _router: Router,
        private _activedRoute: ActivatedRoute,
    ) {
        this._returnUrl = this._activedRoute.snapshot.queryParams.returnUrl;
    }

    ngOnInit() {
        this._title.setTitle('用户登录');
    }

    get f() {
        return this.loginInfo.controls;
    }

    login() {
        this._authService.login(this.loginInfo.value)
            .subscribe(() => {
                console.log(this._returnUrl);
                this._router.navigate([this._returnUrl || '/projects']);
            }, error => {
                this.loginInfo.controls.password.reset();
            });
    }
}
