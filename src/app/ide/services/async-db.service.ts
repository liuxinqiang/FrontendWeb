import {Injectable} from '@angular/core';
import * as PouchDB from 'vendor/pouchdb';

@Injectable()
export class AsyncDbService {

    public localDB: any;
    public remoteDB: any;
    public async: any;

    constructor() {
    }

    public async init(dbName) {
        this.localDB = new PouchDB(dbName);
        this.remoteDB = new PouchDB(`http://localhost:5984/${dbName}`, {
            skip_setup: true,
            auth: {
                username: 'liuxinqiang',
                password: 'liu566114',
            },
        });
        this.async = this.localDB.sync(this.remoteDB, {
            live: true,
            retry: true,
        });
        return new Promise((resolve, reject) => {
            this.localDB.info()
                .then(data => {
                    if (data.doc_count > 0) {
                        resolve();
                    } else {
                        this.async
                            .on('complete', () => {
                                resolve();
                            })
                            .on('error', (error) => {
                                reject(error);
                            });
                    }
                });
        });
    }

    public clear() {
        this.async.cancel();
    }
}
