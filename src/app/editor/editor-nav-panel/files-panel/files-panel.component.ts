import {Component, OnInit} from '@angular/core';
import {EditorService} from '../../services/editor.service';
import {ITreeNode} from '../../interfaces/panel.interface';

function markNode(array: ITreeNode[], prop, value) {
    array.forEach((node: ITreeNode) => {
        node[prop] = value;
        if (node.children.length) {
            markNode(node.children, prop, value);
        }
    });
}

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
        } else {
            this.editorService.setActiveFile({
                file: node.file,
                path: node.path,
                ext: node.ext,
            });
            markNode(this.editorService.files, 'active', false);
            node.active = true;
        }
    }

}
