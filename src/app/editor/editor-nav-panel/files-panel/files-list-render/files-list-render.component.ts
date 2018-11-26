import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ITreeNode} from '../../../interfaces/panel.interface';

@Component({
    selector: 'app-files-list-render',
    templateUrl: './files-list-render.component.html',
    styleUrls: ['./files-list-render.component.less']
})
export class FilesListRenderComponent implements OnInit {

    @Input() filesList: ITreeNode[] = [];

    @Output() nodeSelect: EventEmitter<ITreeNode> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    selectNodeAction(node) {
        this.nodeSelect.emit(node);
    }

}
