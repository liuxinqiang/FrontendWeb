import {Component} from '@angular/core';
import {ITag} from '../interfaces/tag.interface';
import {TagsService} from '../services/tags.service';
import * as PouchDB from 'vendor/pouchdb';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent {
    tags: ITag[];

    constructor(
        public tagsService: TagsService,
    ) {
        this._initDB();
    }

    private _initDB() {
        const localDB = new PouchDB('myDataBase');
        const remoteDB = new PouchDB('http://liuxinqiang:liu566114@localhost:5984/frontend_web', {
            skip_setup: true,
        });
        localDB.sync(remoteDB, {
            live: true
        })
            .on('complete', function () {
                console.log('同步完成...');
            })
            .on('change', function (change) {
                console.log('has change...');
                // yo, something changed!
            })
            .on('error', function (err) {
                console.log('has error...');
                console.error(err);
                // yo, we got an error! (maybe the user went offline?)
            });
    }

    nodeClick(node) {
        console.log('test...');
        console.log(node);
    }

    selectedChange(e) {
        console.log('选择变化');
        console.log(e);
    }
}
