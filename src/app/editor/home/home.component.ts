import {Component, Inject, OnInit} from '@angular/core';
import {GitService} from '../services/git.service';
import {ActivatedRoute} from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {EditorService} from '../services/editor.service';

interface IQueryObj {
    component: string;
    type: string;
    url: string;
};

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

    query: IQueryObj;

    constructor(
        public editorService: EditorService,
        private _gitService: GitService,
        private _activeRoute: ActivatedRoute,
        @Inject(DOCUMENT) private _document: any,
    ) {
        _activeRoute.queryParams.subscribe((data: IQueryObj) => {
            this.query = data;
        });
    }

    editorOptions = {theme: 'vs-dark', language: 'javascript'};
    code = 'function x() {\nconsole.log("Hello world!");\n}';

    getCode() {
        let newCode = '';
        for (let i = 0; i <= 100; i++) {
            newCode += this.code;
        }
        return newCode;
    }

    ngOnInit() {
        this._gitService.initGit()
            .then(data => {
                console.log('获取成功...');
                console.log(data);
            })
            .catch(e => {
                console.log('获取失败');
                console.log(e);
            });
    }
}
