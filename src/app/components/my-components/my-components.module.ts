import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MyComponentsRouterComponents, MyComponentsRouterModule} from './my-components-router.module';
import {CommonComponentsModule} from '../../common/components/common-components.module';
import {ComponentsSharedModule} from '../shared/components-shared.module';

@NgModule({
    declarations: [
        ...MyComponentsRouterComponents,
    ],
    imports: [
        CommonModule,
        CommonComponentsModule,
        MyComponentsRouterModule,
        ComponentsSharedModule,
    ]
})
export class MyComponentsModule {
}
