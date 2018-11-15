import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PublicComponentsComponent} from './public-components/public-components.component';
import {CreateComponentComponent} from './create-component/create-component.component';
import {AuthGuard} from '../common/guards/auth.guard';
import {HomeComponent} from './home/home.component';
import {ComponentDetailComponent} from './shared/component-detail/component-detail.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'public',
            },
            {
                path: 'public',
                component: PublicComponentsComponent,
            },
            {
                path: 'public/:componentName',
                component: ComponentDetailComponent, // 共享组件，不需要在下面导出
            },
            {
                path: 'my-components',
                canActivate: [AuthGuard],
                loadChildren: './my-components/my-components.module#MyComponentsModule'
            },
            {
                path: 'create-component',
                component: CreateComponentComponent,
                canActivate: [AuthGuard],
            }
        ],
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule,
    ],
})
export class ComponentsRouterModule {
}

export const ComponentsRouterComponents = [
    HomeComponent,
    PublicComponentsComponent,
    CreateComponentComponent,
];
