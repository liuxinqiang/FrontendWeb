import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {environment} from 'environments/environment';
import {ActivityService} from '../services/activity.service';

@Component({
    selector: 'app-ide-text-editor',
    templateUrl: './text-editor.component.html',
    styleUrls: ['./text-editor.component.less']
})
export class TextEditorComponent implements AfterViewInit {

    @ViewChild('editorContainer') _editorContainer: ElementRef;

    @Output() loadComplete = new EventEmitter<any>();

    constructor(
        public activityService: ActivityService,
    ) {
    }

    ngAfterViewInit(): void {
        const baseUrl = environment.assetsPath;
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
