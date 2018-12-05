import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditorRoutersComponents, EditorRoutingModule} from './editor-routing.module';
import {FileService} from './services/file.service';
import {GitService} from './services/git.service';
import {EditorPanelService} from './services/editor-panel.service';
import {FormsModule} from '@angular/forms';
import {EditorHeaderComponent} from './header/header.component';
import {MainEditorTopComponent} from './main-editor-top/main-editor-top.component';
import {EditorIconNavComponent} from './editor-icon-nav/editor-icon-nav.component';
import {EditorNavPanelComponent} from './editor-nav-panel/editor-nav-panel.component';
import {FilesPanelComponent} from './editor-nav-panel/files-panel/files-panel.component';
import {SearchPanelComponent} from './editor-nav-panel/search-panel/search-panel.component';
import {ConfigPanelComponent} from './editor-nav-panel/config-panel/config-panel.component';
import {DeployPanelComponent} from './editor-nav-panel/deploy-panel/deploy-panel.component';
import {FilesManagerService} from './services/files-manager.service';
import {FilesListRenderComponent} from './editor-nav-panel/files-panel/files-list-render/files-list-render.component';
import {MainEditorComponent} from './main-editor/main-editor.component';
import {EditorsManagerService} from './services/editors-manager.service';
import {LoadingService} from './services/loading.service';
import {ComponentService} from './services/component.service';
import {HeaderSubmitPanelComponent} from './header/header-submit-panel/header-submit-panel.component';
import {FileStateListRenderComponent} from './header/header-submit-panel/file-state-list-render/file-state-list-render.component';
import {GitLogService} from './services/git-log.service';
import {GitBranchService} from './services/git-branch.service';
import {GitActionService} from './services/git-action.service';
import { HeaderBranchPanelComponent } from './header/header-branch-panel/header-branch-panel.component';
import { HeaderComponentPanelComponent } from './header/header-component-panel/header-component-panel.component';
import { HeaderPullPanelComponent } from './header/header-pull-panel/header-pull-panel.component';

@NgModule({
    declarations: [
        EditorHeaderComponent,
        ...EditorRoutersComponents,
        MainEditorTopComponent,
        EditorIconNavComponent,
        EditorNavPanelComponent,
        FilesPanelComponent,
        SearchPanelComponent,
        ConfigPanelComponent,
        DeployPanelComponent,
        FilesListRenderComponent,
        MainEditorComponent,
        HeaderSubmitPanelComponent,
        FileStateListRenderComponent,
        HeaderBranchPanelComponent,
        HeaderComponentPanelComponent,
        HeaderPullPanelComponent,
    ],
    imports: [
        CommonModule,
        EditorRoutingModule,
        FormsModule,
    ],
    providers: [
        LoadingService,
        FilesManagerService,
        FileService,
        GitService,
        EditorPanelService,
        EditorsManagerService,
        ComponentService,
        GitLogService,
        GitBranchService,
        GitActionService,
    ],
})
export class EditorModule {
}
