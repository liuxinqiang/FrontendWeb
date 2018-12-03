import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-file-state-list-render',
    templateUrl: './file-state-list-render.component.html',
    styleUrls: ['./file-state-list-render.component.less']
})
export class FileStateListRenderComponent implements OnInit {
    @Input() list: string[] = [];

    constructor() {
    }

    ngOnInit() {
    }

}
