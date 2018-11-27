import {Component, OnInit} from '@angular/core';
import {FilesManagerService} from '../services/files-manager.service';
import {ITreeNode} from '../interfaces/panel.interface';
import {FilesService} from '../services/files.service';
import {NgxEditorModel} from 'ngx-monaco-editor';

type IRenderMode = 'editor' | 'image' | 'video' | 'zip' | 'none';

const defaultEditorContent: NgxEditorModel = {
    value: '',
    language: 'text/plain',
    uri: ''
};

const extLangMap = {
    html: 'html',
    ts: 'typescript',
    css: 'css',
    less: 'less',
    sass: 'sass',
    scss: 'scss',
    json: 'json',
};

@Component({
    selector: 'app-main-editor',
    templateUrl: './main-editor.component.html',
    styleUrls: ['./main-editor.component.less']
})
export class MainEditorComponent implements OnInit {
    editor: any;
    file: ITreeNode = null;
    renderMode: IRenderMode = 'editor';
    editorContent: NgxEditorModel = Object.assign({}, defaultEditorContent);

    getEditorContent() {
        if (this.renderMode === 'editor') {
            this._fileService.fs.readFile(this.file.path)
                .then(data => {
                    this.setEditorContent(data);
                });
        } else {
            this.editorContent = Object.assign({}, defaultEditorContent);
        }
    }

    setEditorContent(content) {
        if (this.renderMode === 'editor') {
           this.editorContent = {
               value: content.toString(),
               language: extLangMap[this.file.ext] || defaultEditorContent.language,
               uri: this.file.path,
           };
           const model = monaco.editor.createModel(
               content.toString(),
               extLangMap[this.file.ext] || defaultEditorContent.language
           );
            this.editor.setModel(model);
            model.onDidChangeContent(() => {
                console.log('changed...');
                console.log(model.getValue().length);
            });
        } else {
            //
        }
    }

    constructor(
        private _filesManagerService: FilesManagerService,
        private _fileService: FilesService,
    ) {
        _filesManagerService.activeFile$.subscribe(newActiveFile => {
            if (newActiveFile !== null) {
                this.file = newActiveFile;
                this.calcRenderMode();
                this.getEditorContent();
            } else {
                this.file = null;
            }
        });
    }

    calcRenderMode() {
        if ([
            'js',
            'ts',
            'css',
            'less',
            'scss',
            'sass',
            'html',
            'json',
            'Dockerfile',
            'gitignore',
            'dockerignore',
            'vue'
        ].indexOf(this.file.ext)) {
            this.renderMode = 'editor';
        } else if ([
            'jpg',
            'jpeg',
            'png',
            'gif',
            'ico',
        ].indexOf(this.file.ext)) {
            this.renderMode = 'image';
        } else if ([
            'zip',
        ].indexOf(this.file.ext)) {
            this.renderMode = 'zip';
        } else {
            this.renderMode = 'none';
        }
    }

    onChange(e) {
        console.log('genbianle...');
        console.log(e);
    }

    ngOnInit() {
    }

}
