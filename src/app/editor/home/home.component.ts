import {Component, OnDestroy, OnInit} from '@angular/core';
import {GitService} from '../services/git.service';
import {ActivatedRoute} from '@angular/router';
import {EditorPanelService} from '../services/editor-panel.service';
import {FilesManagerService} from '../services/files-manager.service';
import {IEditorQuery} from '../interfaces/files.interface';
import {EditorsManagerService} from '../services/editors-manager.service';
import {LoadingService} from '../services/loading.service';
import {
    trigger,
    style,
    animate,
    transition,
} from '@angular/animations';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less'],
    animations: [
        trigger('loading', [
            transition(':enter', [
                style({
                    opacity: 0
                }),
                animate('.3s ease-in-out', style({
                    opacity: 1
                }))
            ]),
            transition(':leave', [
                style({
                    opacity: 1
                }),
                animate('.3s ease-in-out', style({
                    opacity: 0
                }))
            ])
        ])
    ],
})
export class HomeComponent implements OnInit, OnDestroy {

    query: IEditorQuery;

    private loadedCount = 0;
    private _mainEditor: any;

    constructor(
        public loadingService: LoadingService,
        public editorPanelService: EditorPanelService,
        private _gitService: GitService,
        private _editorsManagerService: EditorsManagerService,
        private _filesManagerService: FilesManagerService,
        private _activeRoute: ActivatedRoute,
    ) {
        _activeRoute.queryParams.subscribe((data: IEditorQuery) => {
            this.query = data;
            const url = decodeURIComponent(data.url);
            this._editorsManagerService.setReadOnly(!url.includes('/my-components/'));
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

    ngOnDestroy(): void {
        this._filesManagerService.clear();
        this._editorsManagerService.clear();
    }
}
