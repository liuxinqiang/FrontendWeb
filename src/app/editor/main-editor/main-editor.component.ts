import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-main-editor',
    templateUrl: './main-editor.component.html',
    styleUrls: ['./main-editor.component.less']
})
export class MainEditorComponent implements OnInit {

    @Output() loadComplete = new EventEmitter<any>();

    editorLoaded(editor) {
        this.loadComplete.emit(editor);
    }

    ngOnInit() {
    }

}
