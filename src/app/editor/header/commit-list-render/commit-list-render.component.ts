import {Component, Input, OnInit} from '@angular/core';
import {GitCommit} from '../../models/git.model';

@Component({
    selector: 'app-commit-list-render',
    templateUrl: './commit-list-render.component.html',
    styleUrls: ['./commit-list-render.component.less']
})
export class CommitListRenderComponent implements OnInit {
    @Input() list: GitCommit[] = [];
    @Input() isRemote = false;
    @Input() emptyMsg = '暂无任何记录';

    constructor() {
    }

    ngOnInit() {
    }

}
