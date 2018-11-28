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
        const models = monaco.editor.getModels();
        models.forEach(model => model.dispose());
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
                let model = monaco.editor.getModel(monaco.Uri.parse(file.path));
                if (model === null) {
                    const value = await this._fileService.readTextFile(file.path);
                    model = monaco.editor.createModel(
                        value,
                        EditorMapConfig[file.ext] || 'text/plain',
                        monaco.Uri.parse(file.path)
                    );
                    model.onDidChangeContent(async () => {
                        await this._fileService.writeTextFile(file.path, model.getValue());
                    });
                }
                this._editor.setModel(model);
            });
    }

    init(editor) {
        this._editor = editor;
        this.changeActiveEditorMode();
    }
}
