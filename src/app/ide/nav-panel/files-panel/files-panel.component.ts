import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AsyncDbService} from '../../services/async-db.service';
import {IFile} from '../../interfaces/file.interface';
import {ActivityService} from '../../services/activity.service';
import PerfectScrollbar from 'perfect-scrollbar';

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

function autoOpenFolder(filesArray: IFile[], filePath: string) {
    let files = filesArray;
    const folders = filePath.split('/');
    for (let i = 0; i < folders.length; i++) {
        const nodeName = folders[i];
        const nodeFound = files.filter(file => (file.type === 'directory' || (i === folders.length - 1)) && file.name === nodeName)[0];
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
export class FilesPanelComponent implements OnInit, AfterViewInit, OnDestroy {

    private _scrollBar;

    @ViewChild('filesContainer') filesContainer: ElementRef;

    constructor(
        public asyncDBService: AsyncDbService,
        private _activeService: ActivityService,
    ) {
    }

    nodeSelect(node: IFile) {
        if (node.type === 'directory') {
            node.opened = !node.opened;
            this._scrollBar.update();
        } else {
            this._activeService.setActiveFile(node.id);
        }
    }

    ngOnInit() {
        this._activeService.activeFile$.asObservable()
            .subscribe(file => {
                markNode(this.asyncDBService.filesList, 'active', false, ['file']);
                if (file !== null) {
                    autoOpenFolder(this.asyncDBService.filesList, file);
                    this._scrollBar.update();
                }
            });
        this.asyncDBService.filesList$.asObservable()
            .subscribe(() => {
                if (this._scrollBar) {
                    this._scrollBar.update();
                }
            });
    }

    ngAfterViewInit(): void {
        this._scrollBar = new PerfectScrollbar(this.filesContainer.nativeElement);
    }

    ngOnDestroy(): void {
        this._scrollBar.destroy();
        this._scrollBar = null;
    }
}
