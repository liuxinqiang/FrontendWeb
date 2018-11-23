import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-editor-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less']
})
export class EditorHeaderComponent implements OnInit {

    @Input() backUrl = '/';

    constructor() {
    }

    ngOnInit() {
    }

}
