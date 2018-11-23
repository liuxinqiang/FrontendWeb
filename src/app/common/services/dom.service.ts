import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class DomService {

    constructor(
        @Inject(DOCUMENT) private _document: any,
    ) {
    }

    enableFullScreen() {
        const elem = this._document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
    }

    disableFullScreen() {
        if (this._document.exitFullscreen) {
            this._document.exitFullscreen();
        } else if (this._document.mozCancelFullScreen) { /* Firefox */
            this._document.mozCancelFullScreen();
        } else if (this._document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            this._document.webkitExitFullscreen();
        } else if (this._document.msExitFullscreen) { /* IE/Edge */
            this._document.msExitFullscreen();
        }
    }

    public get document(): Document {
        return this._document;
    }
}
