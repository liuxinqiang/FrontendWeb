import { Component, OnInit } from '@angular/core';
import {PanelService} from '../services/panel.service';

@Component({
  selector: 'app-ide-icon-nav',
  templateUrl: './icon-nav.component.html',
  styleUrls: ['./icon-nav.component.less']
})
export class IconNavComponent implements OnInit {

    constructor(public panelService: PanelService) {
    }

    changePanel(id) {
        if (this.panelService.activePanelValue === id) {
            this.panelService.changeActivePanel(null);
        } else {
            this.panelService.changeActivePanel(id);
        }
    }

  ngOnInit() {
  }

}
