import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FilesManagerService} from '../services/files-manager.service';

@Component({
    selector: 'app-main-editor',
    templateUrl: './main-editor.component.html',
    styleUrls: ['./main-editor.component.less']
})
export class MainEditorComponent implements OnInit, AfterViewInit {

    constructor(public filesService: FilesManagerService) {}

    @ViewChild('editorContainer') _editorContainer: ElementRef;

    @Output() loadComplete = new EventEmitter<any>();

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        const baseUrl = '/assets';
        const onGotAmdLoader: any = () => {
            (<any>window).require.config({paths: {'vs': baseUrl + '/monaco/vs'}});
            (<any>window).require.config({
                'vs/nls': {
                    availableLanguages: {
                        '*': 'zh-cn'
                    }
                }
            });
            (<any>window).require(['vs/editor/editor.main'], () => {
                this.loadComplete.emit(this._editorContainer.nativeElement);
            });
        };
        if (!(<any>window).require) {
            const loaderScript: HTMLScriptElement = document.createElement('script');
            loaderScript.type = 'text/javascript';
            loaderScript.src = `${baseUrl}/monaco/vs/loader.js`;
            loaderScript.addEventListener('load', onGotAmdLoader);
            document.body.appendChild(loaderScript);
        } else {
            onGotAmdLoader();
        }
    }
}
