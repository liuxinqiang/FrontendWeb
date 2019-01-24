import {Injectable} from '@angular/core';
import * as PouchDB from 'vendor/pouchdb';
import {BehaviorSubject, Observable} from 'rxjs';
import {getFilesTree} from '../methods/flaten-tree.method';

@Injectable()
export class AsyncDbService {

    public localDB: any;
    public remoteDB: any;
    public async: any;

    private _fileList: BehaviorSubject<any[]>;
    private _remoteChanges: BehaviorSubject<any>;
    private _localChangesChanges: BehaviorSubject<any>;

    public filesList$: Observable<any[]>;
    public localChanges$: Observable<any>;
    public remoteChanges$: Observable<any>;

    constructor() {
        this._fileList = new BehaviorSubject([]);
        this.filesList$ = this._fileList.asObservable();
        this._localChangesChanges = new BehaviorSubject(null);
        this.localChanges$ = this._localChangesChanges.asObservable();
        this._remoteChanges = new BehaviorSubject(null);
        this.remoteChanges$ = this._remoteChanges.asObservable();
    }

    public get filesList() {
        return this._fileList.getValue();
    }

    public async getList(dbName) {
        const result = await this.localDB.allDocs({
            conflicts: true,
        });
        this._fileList.next(getFilesTree(result.rows));
        return true;
    }

    public async init(dbName) {
        this.localDB = new PouchDB(dbName,  { skip_setup: true });

        this.localDB.changes({
            since: 'now',
            live: true,
            include_docs: true
        })
            .on('change', async (event) => {
                this._localChangesChanges.next(event);
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
            .on('change', (event) => {
                console.log('remote change...');
                console.log(event);
                this._remoteChanges.next(event);
            })
            .on('paused', (err) => {
                console.log('remote paused');
                console.log(err);
            }).on('active', () => {
            console.log('remote active');
        }).on('denied', (err) => {
            console.log('remote denied');
            console.log(err);
        }).on('complete', (info) => {
            console.log('remote complete');
            console.log(info);
        }).on('error', (err) => {
            console.log('remote error');
            console.log(err);
        });
    }

    public async syncOff() {
        await this.async.cancel();
    }

    public async clear() {
        await this.syncOff();
        this._fileList.next([]);
        this.localDB = undefined;
        this.remoteDB = undefined;
    }
}
