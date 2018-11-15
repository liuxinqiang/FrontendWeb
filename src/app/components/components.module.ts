import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    ComponentsRouterComponents,
    ComponentsRouterModule
} from './components-router.module';
import {CommonComponentsModule} from 'app/common/components/common-components.module';
import {ComponentsService} from './services/components.service';
import {ComponentsSharedModule} from './shared/components-shared.module';

@NgModule({
    declarations: [
        ...ComponentsRouterComponents,
    ],
    imports: [
        CommonModule,
        ComponentsRouterModule,
        CommonComponentsModule,
        ComponentsSharedModule,
    ],
    providers: [
        ComponentsService,
    ]
})
export class ComponentsModule {
}
