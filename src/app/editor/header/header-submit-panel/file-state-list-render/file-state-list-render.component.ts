import {Component, Input, OnInit} from '@angular/core';
import {FilesManagerService} from '../../../services/files-manager.service';

@Component({
    selector: 'app-file-state-list-render',
    templateUrl: './file-state-list-render.component.html',
    styleUrls: ['./file-state-list-render.component.less']
})
export class FileStateListRenderComponent implements OnInit {
    @Input() list: string[] = [];
    @Input() dir = '';
    @Input() emptyMsg = '文件列表为空...';

    constructor(public filesManagerService: FilesManagerService) {
    }

    ngOnInit() {
    }

}
