import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EntryComponent} from './entry/entry.component';
import {CreateComponent} from './create/create.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
    {
        path: '',
        component: EntryComponent,
        children: [
            {
                path: '',
                component: CreateComponent,
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
    HomeComponent,
];
