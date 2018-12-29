import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'readableFileSize',
    pure: true,
})
export class ReadableFileSizePipe implements PipeTransform {

    transform(value: any, si: boolean = true): any {
        if (!value) {
            return '';
        }
        const thresh = si ? 1000 : 1024;
        if (Math.abs(value) < thresh) {
            return value + ' B';
        }
        const units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        do {
            value /= thresh;
            ++u;
        } while (Math.abs(value) >= thresh && u < units.length - 1);
        return value.toFixed(1) + ' ' + units[u];
    }

}
