import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectsRouterModule, ProjectsRoutersComponents} from './projects-router.module';
import {CommonComponentsModule} from 'app/common/components/common-components.module';

@NgModule({
    declarations: [
        ...ProjectsRoutersComponents,
    ],
    imports: [
        CommonModule,
        ProjectsRouterModule,
        CommonComponentsModule,
    ],
})
export class ProjectsModule {
}
