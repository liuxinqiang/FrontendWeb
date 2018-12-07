import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class DomService {

    constructor(
        @Inject(PLATFORM_ID) private _platformId: Object,
        @Inject(DOCUMENT) private _document: any,
    ) {
    }

    public get isBrowser(): boolean {
        return isPlatformBrowser(this._platformId);
    }

    async enableFullScreen() {
        const elem = this._document.documentElement;
        if (elem.requestFullscreen) {
            await elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            await elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            await elem.msRequestFullscreen();
        }
    }

    async disableFullScreen() {
        if (this._document.exitFullscreen) {
            await this._document.exitFullscreen();
        } else if (this._document.mozCancelFullScreen) { /* Firefox */
            await this._document.mozCancelFullScreen();
        } else if (this._document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            await this._document.webkitExitFullscreen();
        } else if (this._document.msExitFullscreen) { /* IE/Edge */
            await this._document.msExitFullscreen();
        }
    }

    public get document(): Document {
        return this._document;
    }
}
