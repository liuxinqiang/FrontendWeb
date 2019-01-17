import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavPanelComponent} from './nav-panel.component';
import {ConfigPanelComponent} from './config-panel/config-panel.component';
import {DeployPanelComponent} from './deploy-panel/deploy-panel.component';
import {FilesPanelComponent} from './files-panel/files-panel.component';
import {SearchPanelComponent} from './search-panel/search-panel.component';
import {FilesListRenderComponent} from './files-panel/files-list-render/files-list-render.component';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        NavPanelComponent,
        ConfigPanelComponent,
        DeployPanelComponent,
        FilesPanelComponent,
        SearchPanelComponent,
        FilesListRenderComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
    ],
    providers: [
    ],
    exports: [
        NavPanelComponent,
    ],
})
export class NavPanelModule {
}
