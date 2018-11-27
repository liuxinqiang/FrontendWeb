import {Component, OnInit} from '@angular/core';
import {EditorService} from '../services/editor.service';

@Component({
    selector: 'app-main-editor',
    templateUrl: './main-editor.component.html',
    styleUrls: ['./main-editor.component.less']
})
export class MainEditorComponent implements OnInit {
    code = '';
    constructor(
        private _editorService: EditorService,
    ) {
        _editorService.activeFile$.subscribe(newActiveFile => {
            if (newActiveFile !== null) {
                this.code = JSON.stringify(newActiveFile);
            } else {
                this.code = '';
            }
        });
    }

    editorOptions = {
        theme: 'vs-dark',
        language: 'javascript'
    };

    ngOnInit() {
    }

}
