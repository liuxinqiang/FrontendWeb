import {Component, OnDestroy, OnInit} from '@angular/core';
import {BuildService} from '../services/build.service';
import {Subscription} from 'rxjs';
import {retry} from 'rxjs/internal/operators';

@Component({
    selector: 'app-create-component',
    templateUrl: './create-component.component.html',
    styleUrls: ['./create-component.component.less']
})
export class CreateComponentComponent implements OnInit, OnDestroy {

    private _buildSub$: Subscription;

    constructor(
        private _buildService: BuildService,
    ) {
    }

    ngOnInit() {
        this._buildService.sendMessage({
            event: 'builder',
            data: 'test...',
        });
        this._buildSub$ = this._buildService.onMessage()
            .pipe(
                retry()
            )
            .subscribe(data => {
                console.log('收到信息了...');
                console.log(data);
            });
    }

    ngOnDestroy() {
        this._buildSub$.unsubscribe();
        this._buildService.disConnect();
    }

}
