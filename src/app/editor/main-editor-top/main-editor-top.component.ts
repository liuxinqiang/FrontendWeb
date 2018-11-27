import {Component, OnInit} from '@angular/core';
import {FilesManagerService} from '../services/files-manager.service';

@Component({
    selector: 'app-main-editor-top',
    templateUrl: './main-editor-top.component.html',
    styleUrls: ['./main-editor-top.component.less']
})
export class MainEditorTopComponent implements OnInit {

    constructor(
        public filesManagerService: FilesManagerService,
    ) {
    }

    ngOnInit() {
    }

}
