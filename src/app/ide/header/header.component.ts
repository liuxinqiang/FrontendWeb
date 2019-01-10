import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-ide-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

    headerDropConfig = 'mode: click;offset:11;animation: ui-animation-slide-top-small';

    constructor() {
    }

    ngOnInit() {
    }

}
