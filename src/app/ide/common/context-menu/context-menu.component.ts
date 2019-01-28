import {Component, HostListener, OnInit} from '@angular/core';
import {ContextMenuService} from '../../services/context-menu.service';

@Component({
    selector: 'app-ide-context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: [
        './context-menu.component.less'
    ]
})
export class ContextMenuComponent implements OnInit {

    constructor(
        public contextMenuService: ContextMenuService,
    ) {
    }

    setMainSize() {
        this.contextMenuService.metaData.mainWidth = (<any>window).innerWidth;
        this.contextMenuService.metaData.mainHeight = (<any>window).innerHeight;
    }

    ngOnInit() {
        this.setMainSize();
    }

    @HostListener('document:click')
    click() {
       this.contextMenuService.hide();
    }


    @HostListener('window:resize')
    onResize() {
        this.setMainSize();
    }

}
