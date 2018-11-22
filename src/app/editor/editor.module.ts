import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditorRoutersComponents, EditorRoutingModule} from './editor-routing.module';
import {FilesService} from './services/files.service';
import {GitService} from './services/git.service';
import {EditorService} from './services/editor.service';
import {MonacoEditorModule} from 'ngx-monaco-editor';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        ...EditorRoutersComponents,
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
