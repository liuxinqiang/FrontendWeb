import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentDetailComponent} from './component-detail/component-detail.component';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [
        ComponentDetailComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
    ],
    exports: [
        CommonModule,
        ComponentDetailComponent,
    ]
})
export class ComponentsSharedModule {
}
