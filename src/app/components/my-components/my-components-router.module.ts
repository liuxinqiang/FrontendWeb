import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MyComponentsComponent} from './my-components/my-components.component';
import {ComponentDetailComponent} from '../shared/component-detail/component-detail.component';
import {EntryComponent} from './entry/entry.component';

const routes: Routes = [
    {
        path: '',
        component: EntryComponent,
        children: [
            {
                path: '',
                component: MyComponentsComponent,
                data: {
                    title: '我的组件',
                },
            },
            {
                path: ':componentId',
                component: ComponentDetailComponent,
                data: {
                    title: '组件详情',
                },
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
    EntryComponent,
    MyComponentsComponent,
];
