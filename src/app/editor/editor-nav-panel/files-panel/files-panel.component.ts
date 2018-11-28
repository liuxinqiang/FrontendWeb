import {Component, OnInit} from '@angular/core';
import {FilesManagerService} from '../../services/files-manager.service';
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
        public filesManagerService: FilesManagerService,
    ) {
    }

    ngOnInit() {
    }

    nodeSelect(node: ITreeNode) {
        if (node.isDirectory) {
            node.opened = !node.opened;
        } else {
            this.filesManagerService.setActiveFile({
                file: node.file,
                path: node.path,
                ext: node.ext,
                url: node.url,
            });
            markNode(this.filesManagerService.files, 'active', false);
            node.active = true;
        }
    }

}
