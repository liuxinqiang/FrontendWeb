import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PublicComponentsComponent} from './public-components/public-components.component';
import {CreateComponentComponent} from './create-component/create-component.component';
import {AuthGuard} from '../common/guards/auth.guard';
import {ComponentDetailComponent} from './shared/component-detail/component-detail.component';
import {EntryComponent} from './entry/entry.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
    {
        path: '',
        component: EntryComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
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
    EntryComponent,
    PublicComponentsComponent,
    CreateComponentComponent,
];
