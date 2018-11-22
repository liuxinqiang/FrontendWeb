import {Component, OnInit} from '@angular/core';
import {GitService} from '../services/git.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

    constructor(
        private _gitService: GitService,
    ) {
    }

    ngOnInit() {
        this._gitService.initGit()
            .then(data => {
                console.log('获取成功...');
                console.log(data);
            })
            .catch(e => {
                console.log('获取失败');
                console.log(e);
            });
    }
}
