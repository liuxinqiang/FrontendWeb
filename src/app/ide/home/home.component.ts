import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IIdeQuery} from '../interfaces/ide.interface';
import {AsyncDbService} from '../services/async-db.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, OnDestroy {
    query: IIdeQuery;

    constructor(
        private _activeRoute: ActivatedRoute,
        private _dbService: AsyncDbService,
    ) {
    }

    ngOnInit() {
        this._activeRoute.queryParams.subscribe((data: IIdeQuery) => {
            this.query = data;
            this._dbService.init(this.query.id);
        });
    }

    ngOnDestroy(): void {
        this._dbService.clear();
    }

}
