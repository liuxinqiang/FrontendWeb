import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {MyComponentsComponent} from './my-components/my-components.component';
import {ComponentDetailComponent} from '../shared/component-detail/component-detail.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: '',
                component: MyComponentsComponent,
            },
            {
                path: ':componentName',
                component: ComponentDetailComponent,
            },
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
export class MyComponentsRouterModule {
}

export const MyComponentsRouterComponents = [
    HomeComponent,
    MyComponentsComponent,
];
