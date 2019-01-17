import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IdeRouterComponents, IdeRouterModule} from './ide-router.module';
import {AsyncDbService} from './services/async-db.service';
import {FormsModule} from '@angular/forms';
import {HeaderComponent} from './header/header.component';
import {EditorTopComponent} from './editor-top/editor-top.component';
import {IconNavComponent} from './icon-nav/icon-nav.component';
import {TextEditorComponent} from './text-editor/text-editor.component';
import {PanelService} from './services/panel.service';
import {NavPanelModule} from './nav-panel/nav-panel.module';

@NgModule({
    declarations: [
        ...IdeRouterComponents,
        HeaderComponent,
        EditorTopComponent,
        IconNavComponent,
        TextEditorComponent,
    ],
    imports: [
        FormsModule,
        CommonModule,
        IdeRouterModule,
        NavPanelModule,
    ],
    providers: [
        AsyncDbService,
        PanelService,
    ],
})
export class IdeModule {
}
