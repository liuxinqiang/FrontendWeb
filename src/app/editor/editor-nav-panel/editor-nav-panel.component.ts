import {Component, OnInit} from '@angular/core';
import {EditorService} from '../services/editor.service';

@Component({
    selector: 'app-editor-nav-panel',
    templateUrl: './editor-nav-panel.component.html',
    styleUrls: ['./editor-nav-panel.component.less']
})
export class EditorNavPanelComponent implements OnInit {

    constructor(
        public editorService: EditorService,
    ) {
    }

    ngOnInit() {
    }

}
