import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IdeRouterComponents, IdeRouterModule} from './ide-router.module';
import {AsyncDbService} from './services/async-db.service';
import {FormsModule} from '@angular/forms';
import {HeaderComponent} from './header/header.component';
import {EditorTopComponent} from './editor-top/editor-top.component';
import {IconNavComponent} from './icon-nav/icon-nav.component';
import {TextEditorComponent} from './text-editor/text-editor.component';
import {NavPanelComponent} from './nav-panel/nav-panel.component';

@NgModule({
    declarations: [
        ...IdeRouterComponents,
        HeaderComponent,
        EditorTopComponent,
        IconNavComponent,
        NavPanelComponent,
        TextEditorComponent,
    ],
    imports: [
        FormsModule,
        CommonModule,
        IdeRouterModule,
    ],
    providers: [
        AsyncDbService,
    ],
})
export class IdeModule {
}
