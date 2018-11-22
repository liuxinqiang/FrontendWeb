import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserRouterComponents, UserRouterModule} from './user-router.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonComponentsModule} from 'app/common/components/common-components.module';

@NgModule({
    declarations: [
        ...UserRouterComponents,
    ],
    imports: [
        CommonComponentsModule,
        UserRouterModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
    ]
})
export class UserModule {
}
