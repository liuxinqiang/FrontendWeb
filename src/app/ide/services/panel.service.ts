import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {INavPanelType} from '../interfaces/panel.interface';
@Injectable()
export class PanelService {

    public navMenus = [
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

    private activePanel$: BehaviorSubject<INavPanelType>;

    constructor() {
        this.activePanel$ = new BehaviorSubject<INavPanelType>('files');
    }

    public get activePanelValue(): INavPanelType {
        return this.activePanel$.getValue();
    }

    changeActivePanel(newPanel: INavPanelType) {
        this.activePanel$.next(newPanel);
    }
}
