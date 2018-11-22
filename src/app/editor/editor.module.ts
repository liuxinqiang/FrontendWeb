import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditorRoutersComponents, EditorRoutingModule} from './editor-routing.module';
import {FilesService} from './services/files.service';
import {GitService} from './services/git.service';
import {EditorService} from './services/editor.service';

@NgModule({
    declarations: [
        ...EditorRoutersComponents,
    ],
    imports: [
        CommonModule,
        EditorRoutingModule,
    ],
    providers: [
        FilesService,
        GitService,
        EditorService,
    ],
})
export class EditorModule {
}
