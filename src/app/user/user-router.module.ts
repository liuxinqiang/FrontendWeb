import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {UserComponent} from './user.component';
import {RequestResetComponent} from './request-reset/request-reset.component';
import {ResetComponent} from './reset/reset.component';

const routes: Routes = [
    {
        path: '',
        component: UserComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent,
                data: {
                    title: '用户登录',
                },
            },
            {
                path: 'register',
                component: RegisterComponent,
                data: {
                    title: '用户注册',
                },
            },
            {
                path: 'request-reset',
                component: RequestResetComponent,
                data: {
                    title: '请求重置密码',
                },
            },
            {
                path: 'reset',
                component: ResetComponent,
                data: {
                    title: '重置密码',
                },
            },
        ],
    },
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule,
    ]
})
export class UserRouterModule {
}

export const UserRouterComponents = [
    UserComponent,
    LoginComponent,
    RegisterComponent,
    RequestResetComponent,
    ResetComponent,
];
