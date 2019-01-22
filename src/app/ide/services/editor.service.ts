import {Injectable} from '@angular/core';

@Injectable()
export class EditorService {

    private _container: HTMLDivElement;

    constructor() {
    }

    init(editorContainer: HTMLDivElement) {
        this._container = editorContainer;
        // this.setModelBaseOnActiveFile();
        // this.setModelsBaseOnFiles();
    }
}
