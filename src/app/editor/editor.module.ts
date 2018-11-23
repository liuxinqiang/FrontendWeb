import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditorRoutersComponents, EditorRoutingModule} from './editor-routing.module';
import {FilesService} from './services/files.service';
import {GitService} from './services/git.service';
import {EditorService} from './services/editor.service';
import {MonacoEditorModule} from 'ngx-monaco-editor';
import {FormsModule} from '@angular/forms';
import {EditorHeaderComponent} from './header/header.component';
import { MainEditorTopComponent } from './main-editor-top/main-editor-top.component';
import { EditorIconNavComponent } from './editor-icon-nav/editor-icon-nav.component';
import { EditorNavPanelComponent } from './editor-nav-panel/editor-nav-panel.component';

@NgModule({
    declarations: [
        EditorHeaderComponent,
        ...EditorRoutersComponents,
        MainEditorTopComponent,
        EditorIconNavComponent,
        EditorNavPanelComponent,
    ],
    imports: [
        CommonModule,
        EditorRoutingModule,
        FormsModule,
        MonacoEditorModule.forRoot(),
    ],
    providers: [
        FilesService,
        GitService,
        EditorService,
    ],
})
export class EditorModule {
}
