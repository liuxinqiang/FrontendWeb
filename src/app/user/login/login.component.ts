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
        console.log(this._returnUrl);
    }

    get f() {
        return this.loginInfo.controls;
    }

    login() {
        this._authService.login(this.loginInfo.value)
            .subscribe(() => {
                this._router.navigateByUrl('/editor?type=component&component=subform&url=%2Fcomponents%2Fpublic%2Fsubform' || '/projects');
            }, error => {
                this.loginInfo.controls.password.reset();
            });
    }
}
