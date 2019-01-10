import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IIdeQuery} from '../interfaces/ide.interface';
import {AsyncDbService} from '../services/async-db.service';

let process;

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
    ) {
    }

    async setContent() {
        this.data = await this._dbService.localDB.get('src/app/app.module.ts');
    }

    async ngOnInit() {
        this._activeRoute.queryParams.subscribe(async (data: IIdeQuery) => {
            this.query = data;
            await this._dbService.init(this.query.id);
            await this.setContent();
        });
        this._dbService.async
            .on('change', async (info) => {
                if (info.direction === 'pull') {
                    await this.setContent();
                }
            });
        this._dbService.localDB.changes()
            .on('change', async () => {
                await this.setContent();
            });
    }

    ngOnDestroy(): void {
        this._dbService.clear();
    }

    contentChanges() {
        if (process) {
            return;
        }
        process = true;
        this._dbService.localDB.put(this.data)
            .then((data) => {
                process = false;
                console.log(data);
                this.data._rev = data.rev;
                console.log('保存成功...');
            });
    }

}
