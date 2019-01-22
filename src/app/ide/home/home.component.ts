import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IIdeQuery} from '../interfaces/ide.interface';
import {AsyncDbService} from '../services/async-db.service';
import {PanelService} from '../services/panel.service';
import {EditorService} from '../services/editor.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, OnDestroy {
    query: IIdeQuery;
    data: any;

    constructor(
        private _activeRoute: ActivatedRoute,
        private _dbService: AsyncDbService,
        private _editorService: EditorService,
        public panelService: PanelService,
    ) {
    }

    async ngOnInit() {
        this._activeRoute.queryParams.subscribe(async (data: IIdeQuery) => {
            this.query = data;
            await this._dbService.init(this.query.id);
        });
    }

    ngOnDestroy(): void {
        this._dbService.syncOff().then();
    }

    textEditorLoaded(element: HTMLDivElement) {
        this._editorService.init(element);
    }

}
