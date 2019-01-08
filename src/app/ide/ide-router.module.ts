import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
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
                data: {
                    title: '在线编辑器',
                },
            },
        ],
    },
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule,
    ]
})
export class IdeRouterModule {
}

export const IdeRouterComponents = [
    EntryComponent,
    HomeComponent,
];
