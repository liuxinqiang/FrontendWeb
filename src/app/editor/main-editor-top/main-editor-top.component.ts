import {Component, OnInit} from '@angular/core';
import {EditorService} from '../services/editor.service';

@Component({
    selector: 'app-main-editor-top',
    templateUrl: './main-editor-top.component.html',
    styleUrls: ['./main-editor-top.component.less']
})
export class MainEditorTopComponent implements OnInit {

    constructor(
        public editorService: EditorService,
    ) {
    }

    ngOnInit() {
    }

}
