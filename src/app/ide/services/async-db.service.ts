import {Injectable} from '@angular/core';
import * as PouchDB from 'vendor/pouchdb';
import {BehaviorSubject} from 'rxjs';
import {getFilesTree} from '../methods/flaten-tree.method';

@Injectable()
export class AsyncDbService {

    public localDB: any;
    public remoteDB: any;
    public async: any;

    public filesList$: BehaviorSubject<any[]>;

    public localChanges$: BehaviorSubject<any>;

    public remoteChanges$: BehaviorSubject<any>;

    constructor() {
        this.filesList$ = new BehaviorSubject([]);
        this.localChanges$ = new BehaviorSubject(null);
        this.remoteChanges$ = new BehaviorSubject(null);
    }

    public get filesList() {
        return this.filesList$.getValue();
    }

    public async getList(dbName) {
        const result = await this.localDB.allDocs({
            conflicts: true,
        });
        this.filesList$.next(getFilesTree(result.rows));
        return true;
    }

    public async init(dbName) {
        this.localDB = new PouchDB(dbName);

        this.localDB.changes()
            .on('change', async (event) => {
                this.localChanges$.next(event);
            });
        this.syncOn(dbName);
        return new Promise((resolve, reject) => {
            this.localDB.info()
                .then(data => {
                    if (data.doc_count > 0) {
                        return this.getList(dbName);
                    } else {
                        this.async
                            .on('change', () => {
                                return this.getList(dbName);
                            })
                            .on('error', (error) => {
                                console.log('remote 获取失败...');
                                reject(error);
                            });
                    }
                });
        });
    }

    public syncOn(dbName) {
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

        this.async
            .on('change',  (event) => {
                console.log('remote change...');
                console.log(event);
                this.remoteChanges$.next(event);
            })
            .on('paused',  (err) => {
                console.log('remote paused');
                console.log(err);
            }).on('active',  () => {
                console.log('remote active');
            }).on('denied', (err) => {
                console.log('remote denied');
                console.log(err);
            }).on('complete',  (info) => {
                console.log('remote complete');
                console.log(info);
            }).on('error', (err) => {
                console.log('remote error');
                console.log(err);
            });
    }

    public async syncOff() {
        // await this.async.cancel();
    }
}
