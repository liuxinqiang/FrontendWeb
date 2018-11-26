import {Component, OnInit} from '@angular/core';
import {EditorService} from '../../services/editor.service';
import {ITreeNode} from '../../interfaces/panel.interface';

@Component({
    selector: 'app-files-panel',
    templateUrl: './files-panel.component.html',
    styleUrls: ['./files-panel.component.less']
})
export class FilesPanelComponent implements OnInit {

    constructor(
        public editorService: EditorService,
    ) {
    }

    ngOnInit() {
    }

    nodeSelect(node: ITreeNode) {
        if (node.isDirectory) {
            node.opened = !node.opened;
        }
    }

}
