import {Component, OnDestroy, OnInit} from '@angular/core';
import {BuildService} from '../services/build.service';
import {Subscription} from 'rxjs';

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
        this._buildService.sendMessage('hello wrold');
        this._buildSub$ = this._buildService.onMessage()
            .subscribe(data => {
                console.log('builder 收到信息了...');
                console.log(data);
            });
    }

    ngOnDestroy() {
        this._buildSub$.unsubscribe();
        this._buildService.disConnect();
    }

}
