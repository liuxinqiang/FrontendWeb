import {Component, OnInit} from '@angular/core';
import {PanelService} from '../services/panel.service';

@Component({
    selector: 'app-ide-nav-panel',
    templateUrl: './nav-panel.component.html',
    styleUrls: ['./nav-panel.component.less']
})
export class NavPanelComponent implements OnInit {

    constructor(
        public panelService: PanelService,
    ) {}


    ngOnInit() {
    }

}
