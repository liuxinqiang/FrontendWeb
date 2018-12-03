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

function autoOpenFolder(filesArray: ITreeNode[], folders: string[]) {
    let files = filesArray;
    for (let i = 0; i < folders.length; i++) {
        const nodeName = folders[i];
        const nodeFound = files.filter(file => (file.isDirectory || (i === folders.length - 1)) && file.file === nodeName)[0];
        if (nodeFound) {
            if (i === folders.length - 1) {
                nodeFound.active = true;
            } else {
                nodeFound.opened = true;
                files = nodeFound.children;
            }
        } else {
            break;
        }
    }
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
        filesManagerService.activeFile$.subscribe(newActiveFile => {
            this.markActiveFile(newActiveFile);
        });
    }

    ngOnInit() {
    }

    markActiveFile(newActiveFile: ITreeNode) {
        const files = this.filesManagerService.files;
        markNode(files, 'active', false);
        if (newActiveFile === null) {
            return;
        }
        const {path} = newActiveFile;
        const pathArray = path.split('/');
        const fileName = pathArray[pathArray.length - 1];
        let activeFile: ITreeNode;
        if (pathArray.length <= 2) {
            activeFile = files.filter(file => file.file === fileName)[0];
        } else {
            const folders = pathArray.splice(1, pathArray.length - 1);
            autoOpenFolder(files, folders);
        }
        if (activeFile) {
            activeFile.active = true;
        }
    }

    nodeSelect(node: ITreeNode) {
        if (node.isDirectory) {
            node.opened = !node.opened;
        } else {
            this.filesManagerService.setActiveFile(node.path);
        }
    }

}
