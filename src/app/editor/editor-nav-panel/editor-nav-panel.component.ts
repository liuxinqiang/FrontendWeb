import {Component, OnInit} from '@angular/core';
import {EditorPanelService} from '../services/editor-panel.service';

@Component({
    selector: 'app-editor-nav-panel',
    templateUrl: './editor-nav-panel.component.html',
    styleUrls: ['./editor-nav-panel.component.less']
})
export class EditorNavPanelComponent implements OnInit {

    constructor(
        public editorPanelService: EditorPanelService,
    ) {
    }

    ngOnInit() {
    }

}
