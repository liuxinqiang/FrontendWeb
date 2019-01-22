import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef} from '@angular/core';
import {IFile} from '../../../interfaces/file.interface';

@Component({
    selector: 'app-files-list-render',
    templateUrl: './files-list-render.component.html',
    styleUrls: ['./files-list-render.component.less']
})
export class FilesListRenderComponent implements OnInit {

    @Input() filesList: IFile[] = [];

    @Output() nodeSelect: EventEmitter<IFile> = new EventEmitter();

    ngOnInit() {
    }
}
