import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class DomService {

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        @Inject(DOCUMENT) private doc: any,
    ) {
    }

    public get isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }

    async enableFullScreen() {
        const elem = this.doc.documentElement;
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
        if (this.doc.exitFullscreen) {
            await this.doc.exitFullscreen();
        } else if (this.doc.mozCancelFullScreen) { /* Firefox */
            await this.doc.mozCancelFullScreen();
        } else if (this.doc.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            await this.doc.webkitExitFullscreen();
        } else if (this.doc.msExitFullscreen) { /* IE/Edge */
            await this.doc.msExitFullscreen();
        }
    }

    public get document(): Document {
        return this.doc;
    }
}
