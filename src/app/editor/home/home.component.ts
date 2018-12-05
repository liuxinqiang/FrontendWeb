import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {GitService} from '../services/git.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EditorPanelService} from '../services/editor-panel.service';
import {FilesManagerService} from '../services/files-manager.service';
import {IEditorQuery} from '../interfaces/files.interface';
import {EditorsManagerService} from '../services/editors-manager.service';
import {ILoading, LoadingService, LoadingState} from '../services/loading.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {ComponentService} from '../services/component.service';
import {Subscription} from 'rxjs';
import {GitActionService} from '../services/git-action.service';
import {FileService} from '../services/file.service';
import {GitLogService} from '../services/git-log.service';

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

    public loading: ILoading;

    private _loadingSubscription: Subscription;

    private loadedCount = 0;
    private _mainEditor: any;

    constructor(
        public editorPanelService: EditorPanelService,
        private _loadingService: LoadingService,
        private _fileService: FileService,
        private _gitService: GitService,
        private _gitActionService: GitActionService,
        private _gitLogService: GitLogService,
        private _editorsManagerService: EditorsManagerService,
        private _filesManagerService: FilesManagerService,
        private _componentService: ComponentService,
        private _activeRoute: ActivatedRoute,
        private _router: Router,
        private _ref: ChangeDetectorRef,
    ) {
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
        this._activeRoute.queryParams.subscribe((data: IEditorQuery) => {
            this.query = data;
            const url = decodeURIComponent(data.url);
            this._editorsManagerService.setReadOnly(!url.includes('/my-components/'));
        });
        this._loadingSubscription = this._loadingService.listener$.subscribe(data => {
            this.loading = data;
            this._ref.detectChanges();
        });
        this._loadingService.setState({
            state: LoadingState.loading,
            message: '获取项目信息',
        });
        this._componentService.init(this.query)
            .then(() => {
                this._loadingService.setState({
                    state: LoadingState.loading,
                    message: '初始化文件系统',
                });
                return this._fileService.init();
            })
            .then(() => {
                this._loadingService.setState({
                    state: LoadingState.loading,
                    message: '设置代码仓库',
                });
                return this._gitService.init();
            })
            .then(() => {
                this._loadingService.setState({
                    state: LoadingState.loading,
                    message: '获取代码仓库状态信息',
                });
                return Promise.all([
                    this._gitLogService.calcAsyncStatus(),
                    this._gitActionService.init(),
                    this._filesManagerService.init(),
                ]);
            })
            .then(() => {
                this._loadingService.setState({
                    state: LoadingState.success
                });
                this.loadedCount++;
                this.loadCompleteHook();
            })
            .catch(error => {
                console.error(error);
                this._loadingService.setState({
                    state: LoadingState.fail,
                    message: typeof error === 'string' ? error : '初始化失败',
                });
            });
    }

    ngOnDestroy(): void {
        this._filesManagerService.clear();
        this._editorsManagerService.clear();
        this._gitActionService.clear();
        if (this._loadingSubscription) {
            this._loadingSubscription.unsubscribe();
        }
    }
}
