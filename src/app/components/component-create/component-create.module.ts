import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentCreateRouterModule, ComponentCreateRoutes} from './component-create-router.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonComponentsModule} from 'app/common/components/common-components.module';
import {ComponentsSharedModule} from '../shared/components-shared.module';

@NgModule({
    declarations: [
        ...ComponentCreateRoutes,
    ],
    imports: [
        CommonModule,
        CommonComponentsModule,
        ComponentCreateRouterModule,
        FormsModule,
        ReactiveFormsModule,
        ComponentsSharedModule,
    ]
})
export class ComponentCreateModule {
}
