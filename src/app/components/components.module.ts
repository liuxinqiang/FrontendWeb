import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    ComponentsRouterComponents,
    ComponentsRouterModule
} from './components-router.module';
import {CommonComponentsModule} from '../common/components/common-components.module';
import {ComponentsSharedModule} from './shared/components-shared.module';
import {TagsService} from './services/tags.service';
import {BuildService} from './services/build.service';

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
        TagsService,
        BuildService,
    ]
})
export class ComponentsModule {
}
