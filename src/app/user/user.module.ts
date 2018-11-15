import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserRouterComponents, UserRouterModule} from './user-router.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        ...UserRouterComponents,
    ],
    imports: [
        UserRouterModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
    ]
})
export class UserModule {
}
