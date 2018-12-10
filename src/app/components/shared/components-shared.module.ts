import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentDetailComponent} from './component-detail/component-detail.component';
import {RouterModule} from '@angular/router';
import {ComponentThumbRenderComponent} from './component-thumb-render/component-thumb-render.component';
import {ComponentsTagsRenderComponent} from './components-tags-render/components-tags-render.component';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        ComponentDetailComponent,
        ComponentThumbRenderComponent,
        ComponentsTagsRenderComponent,
    ],
    imports: [
        FormsModule,
        CommonModule,
        RouterModule,
    ],
    exports: [
        CommonModule,
        ComponentDetailComponent,
        ComponentThumbRenderComponent,
        ComponentsTagsRenderComponent,
    ]
})
export class ComponentsSharedModule {
}
