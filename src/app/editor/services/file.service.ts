import {Injectable} from '@angular/core';
import * as FS from 'vendor/fs.js';
import * as pify from 'vendor/pify.js';
import {LoadingService, LoadingState} from './loading.service';

@Injectable()
export class FileService {

    public fs;

    private options = {
        fs: 'IndexedDB',
        options: {}
    };

    init(): Promise<any> {
        return new Promise((resolve, reject) => {
            FS.configure(this.options, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                const fs = FS.BFSRequire('fs');
                this.fs = pify(fs);
                resolve();
            });
        });
    }

    async readTextFile(path): Promise<string> {
        return this.fs.readFile(path)
            .then(data => data.toString());
    }

    async writeTextFile(path, content): Promise<boolean> {
        return this.fs.writeFile(path, content, 'utf-8');
    }
}
