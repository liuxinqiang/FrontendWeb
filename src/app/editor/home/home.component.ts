import {Component, OnInit} from '@angular/core';
import {GitService} from '../services/git.service';
import {ActivatedRoute} from '@angular/router';
import {EditorPanelService} from '../services/editor-panel.service';
import {FilesManagerService} from '../services/files-manager.service';
import {IEditorQuery} from '../interfaces/files.interface';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

    query: IEditorQuery;

    constructor(
        public editorPanelService: EditorPanelService,
        private _gitService: GitService,
        private _filesManagerService: FilesManagerService,
        private _activeRoute: ActivatedRoute,
    ) {
        _activeRoute.queryParams.subscribe((data: IEditorQuery) => {
            this.query = data;
        });
    }

    ngOnInit() {
        this._filesManagerService.init(this.query).then();
    }
}
