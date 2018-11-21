import {Pipe} from '@angular/core';

@Pipe({
    name: 'objectFirstKey',
    pure: true,
})
export class ObjectFirstKeyPipe {
    transform(obj): string {
        if (obj === null || !(obj instanceof Object)) {
            return '';
        }
        const keys = Object.keys(obj);
        if (keys && keys.length > 0) {
            return keys[0];
        }
        return '';
    }
}
