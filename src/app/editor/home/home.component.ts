import {Component, OnDestroy, OnInit} from '@angular/core';
import {GitService} from '../services/git.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EditorPanelService} from '../services/editor-panel.service';
import {FilesManagerService} from '../services/files-manager.service';
import {IEditorQuery} from '../interfaces/files.interface';
import {EditorsManagerService} from '../services/editors-manager.service';
import {LoadingService, LoadingState} from '../services/loading.service';
import {animate, style, transition, trigger,} from '@angular/animations';
import {ComponentService} from '../services/component.service';

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
        private _componentService: ComponentService,
        private _activeRoute: ActivatedRoute,
        private _router: Router,
    ) {
        _activeRoute.queryParams.subscribe((data: IEditorQuery) => {
            this.query = data;
            const url = decodeURIComponent(data.url);
            this._editorsManagerService.setReadOnly(!url.includes('/my-components/'));
        });
    }

    reload() {
        window.location.reload();
    }

    goBack() {
        if (this.query.url) {
            this._router.navigateByUrl(decodeURIComponent(this.query.url));
        } else {
            window.history.back();
        }
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
        this._componentService.init(this.query)
            .then((component) => {
                return this._filesManagerService.init(component);
            })
            .then(() => {
                this.loadedCount++;
                this.loadCompleteHook();
            })
            .catch(error => {
                this.loadingService.setState({
                    state: LoadingState.fail,
                    message: typeof error === 'string' ? error : '初始化失败',
                });
            });
    }

    ngOnDestroy(): void {
        this._filesManagerService.clear();
        this._editorsManagerService.clear();
    }
}
