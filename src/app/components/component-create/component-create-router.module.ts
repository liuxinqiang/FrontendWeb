import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EntryComponent} from './entry/entry.component';
import {CreateComponent} from './create/create.component';
import {AddGitTokenComponent} from './create/add-git-token/add-git-token.component';

const routes: Routes = [
    {
        path: '',
        component: EntryComponent,
        children: [
            {
                path: '',
                component: CreateComponent,
                data: {
                    title: '新建组件',
                },
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
    ]
})
export class ComponentCreateRouterModule {
}

export const ComponentCreateRoutes = [
    EntryComponent,
    CreateComponent,
    AddGitTokenComponent,
];
