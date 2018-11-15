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
            },
            {
                path: 'register',
                component: RegisterComponent,
            },
            {
                path: 'request-reset',
                component: RequestResetComponent,
            },
            {
                path: 'reset',
                component: ResetComponent,
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
