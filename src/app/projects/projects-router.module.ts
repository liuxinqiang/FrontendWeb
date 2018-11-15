import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProjectsComponent} from './projects.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ProjectsComponent,
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule,
    ]
})
export class ProjectsRouterModule {}
export const ProjectsRoutersComponents = [
    ProjectsComponent,
];
