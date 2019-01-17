import {Component, OnInit} from '@angular/core';
import {AsyncDbService} from '../../services/async-db.service';

function markNode(array: any[], prop, value) {
    array.forEach((node: any) => {
        node[prop] = value;
        if (node.children.length) {
            markNode(node.children, prop, value);
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


    ngOnInit() {
    }

}
