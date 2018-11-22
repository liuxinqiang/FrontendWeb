import {Injectable} from '@angular/core';
import * as FS from 'vendor/fs.js';
import * as pify from 'vendor/pify.js';

@Injectable()
export class FilesService {

    private options = {
        fs: 'IndexedDB',
        options: {}
    };

    init(): Promise<[any, any]> {
        return new Promise((resolve, reject) => {
            FS.configure(this.options, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                const fs = FS.BFSRequire('fs');
                const pfs = pify(fs);
                resolve([fs, pfs]);
            });
        });
    }
}
