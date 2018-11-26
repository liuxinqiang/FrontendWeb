import {Component} from '@angular/core';
import {EditorService} from '../services/editor.service';

@Component({
    selector: 'app-editor-icon-nav',
    templateUrl: './editor-icon-nav.component.html',
    styleUrls: ['./editor-icon-nav.component.less']
})
export class EditorIconNavComponent {

    navMenus = [
        {
            id: 'files',
            name: '文件',
            icon: 'folder',
        },
        {
            id: 'search',
            name: '搜索',
            icon: 'search',
        },
        {
            id: 'config',
            name: '配置',
            icon: 'cog',
        },
        {
            id: 'deploy',
            name: '部署',
            icon: 'cloud-upload',
        },
    ];

    constructor(
        public editorService: EditorService,
    ) {
    }

}
