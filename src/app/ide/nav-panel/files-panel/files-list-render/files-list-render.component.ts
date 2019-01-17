import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef} from '@angular/core';

@Component({
    selector: 'app-files-list-render',
    templateUrl: './files-list-render.component.html',
    styleUrls: ['./files-list-render.component.less']
})
export class FilesListRenderComponent implements OnInit {

    @Input() filesList: any[] = [];

    @Output() nodeSelect: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
    }

    nodeClick(node) {
        if (node.type === 'directory') {
            node.opened = !node.opened;
        } else {
            node.active = !node.active;
        }
    }
}
