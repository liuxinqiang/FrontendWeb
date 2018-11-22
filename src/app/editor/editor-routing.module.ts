import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EntryComponent} from './entry/entry.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: EntryComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
            }
        ]
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
export class EditorRoutingModule {}
export const EditorRoutersComponents = [
    EntryComponent,
    HomeComponent,
];
