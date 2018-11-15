import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectsRouterModule, ProjectsRoutersComponents} from './projects-router.module';

@NgModule({
    declarations: [
        ...ProjectsRoutersComponents,
    ],
    imports: [
        CommonModule,
        ProjectsRouterModule,
    ],
})
export class ProjectsModule {
}
