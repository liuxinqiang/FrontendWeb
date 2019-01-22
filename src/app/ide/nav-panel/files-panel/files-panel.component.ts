import {Component, OnInit} from '@angular/core';
import {AsyncDbService} from '../../services/async-db.service';
import {IFile} from '../../interfaces/file.interface';

function markNode(array: IFile[], prop, value, typeFilter = ['file', 'directory']) {
    array.forEach((node: IFile) => {
        if (typeFilter.indexOf(node.type) >= 0) {
            node[prop] = value;
        }
        if (node.type === 'directory' && node.children.length) {
            markNode(node.children, prop, value, typeFilter);
        }
    });
}

function autoOpenFolder(filesArray: any[], folders: string[]) {
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
        public asyncDBService: AsyncDbService,
    ) {
    }

    nodeSelect(node: IFile) {
        console.log(this.asyncDBService.filesList);
        if (node.type === 'directory') {
            node.opened = !node.opened;
        } else {
            markNode(this.asyncDBService.filesList, 'active', false, ['file']);
            node.active = true;
        }
        console.log(node);
    }

    ngOnInit() {
    }

}
