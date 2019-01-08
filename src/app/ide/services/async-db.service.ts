import {Injectable} from '@angular/core';
import * as PouchDB from 'vendor/pouchdb';

@Injectable()
export class AsyncDbService {

    public localDB: any;
    public remoteDB: any;
    private async: any;

    constructor() {
    }

    public init(dbName) {
        this.localDB = new PouchDB(dbName);
        this.remoteDB = new PouchDB(`http://liuxinqiang:liu566114@localhost:5984/${dbName}`, {
            skip_setup: true,
        });
        this.async = this.localDB.sync(this.remoteDB, {
            live: true
        });
    }

    public clear() {
        this.async.cancel();
    }
}
