import {Injectable} from '@angular/core';
import {FilesManagerService} from './files-manager.service';
import {FilesService} from './files.service';
import {filter} from 'rxjs/operators';
import {EditorMapConfig} from '../editor.config';

@Injectable()
export class EditorsManagerService {

    private _editor;

    constructor(
        private _filesManagerService: FilesManagerService,
        private _fileService: FilesService,
    ) {
    }
    clear() {
        // const models = monaco.editor.getModels();
        // models.forEach(model => model.dispose());
    }

    changeActiveEditorMode() {
        this._filesManagerService.activeFile$
            .pipe(
                filter(file => {
                    if (file !== null) {
                        return true;
                    } else {
                        return false;
                    }
                })
            )
            .subscribe(async file => {
                let model = monaco.editor.getModel(monaco.Uri.parse(file.url));
                if (model === null) {
                    const value = await this._fileService.readTextFile(file.path);
                    model = monaco.editor.createModel(
                        value,
                        EditorMapConfig[file.ext] || 'text/plain',
                        monaco.Uri.parse(file.url)
                    );
                    model.onDidChangeContent(async () => {
                        await this._fileService.writeTextFile(file.path, model.getValue());
                    });
                }
                this._editor.setModel(model);
            });
    }

    init(editorContainer: HTMLDivElement) {
        this._editor = monaco.editor.create(editorContainer, {
            model: null,
            theme: 'vs-dark',
            language: 'text/plain',
        });
        // monaco.editor
        // this._editor = editor;
        // this._emptyModel = monaco.editor.createModel('', 'text/plain', monaco.Uri.parse('/'));
        this.changeActiveEditorMode();
    }
}
