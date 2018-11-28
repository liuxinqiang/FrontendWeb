import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

@Component({
    selector: 'app-main-editor',
    templateUrl: './main-editor.component.html',
    styleUrls: ['./main-editor.component.less']
})
export class MainEditorComponent implements OnInit, AfterViewInit {

    @ViewChild('editorContainer') _editorContainer: ElementRef;

    @Output() loadComplete = new EventEmitter<any>();

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        const baseUrl = '/assets/monaco';
        const onGotAmdLoader: any = () => {
            (<any>window).require.config({paths: {'vs': baseUrl}});
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
            loaderScript.src = `${baseUrl}/loader.js`;
            loaderScript.addEventListener('load', onGotAmdLoader);
            document.body.appendChild(loaderScript);
        } else {
            onGotAmdLoader();
        }
    }
}
