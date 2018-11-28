import {Component, OnInit} from '@angular/core';
import {GitService} from '../services/git.service';
import {ActivatedRoute} from '@angular/router';
import {EditorPanelService} from '../services/editor-panel.service';
import {FilesManagerService} from '../services/files-manager.service';
import {IEditorQuery} from '../interfaces/files.interface';
import {EditorsManagerService} from '../services/editors-manager.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

    query: IEditorQuery;

    private loadedCount = 0;
    private _mainEditor: any;

    constructor(
        public editorPanelService: EditorPanelService,
        private _gitService: GitService,
        private _editorsManagerService: EditorsManagerService,
        private _filesManagerService: FilesManagerService,
        private _activeRoute: ActivatedRoute,
    ) {
        _activeRoute.queryParams.subscribe((data: IEditorQuery) => {
            this.query = data;
        });
    }

    loadCompleteHook() {
        if (this.loadedCount === 2) {
            this._editorsManagerService.init(this._mainEditor);
        }
    }

    mainEditorLoaded(editor) {
        this._mainEditor = editor;
        this.loadedCount++;
        this.loadCompleteHook();
    }

    ngOnInit() {
        this._filesManagerService.init(this.query).then(() => {
            this.loadedCount++;
            this.loadCompleteHook();
        });
    }
}
