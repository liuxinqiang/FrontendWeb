import {Injectable} from '@angular/core';

export interface IMenu {
    type: 'item' | 'line';
    icon?: string;
    label?: string;
    command?: Function;
    key?: string;
}

export interface IContextMetaData {
    top: number;
    left: number;
    width?: number;
    mainWidth?: number;
    mainHeight?: number;
    menus: IMenu[];
}

@Injectable()
export class ContextMenuService {
    private _show = false;

    public metaData: IContextMetaData = {
        top: 0,
        left: 0,
        width: 130,
        menus: [],
    };

    private _calcRealSize(metaData: IContextMetaData) {
        let height = 0;
        const width = metaData.width || this.metaData.width;
        metaData.menus.map(menu => {
            if (menu.type === 'item') {
                height += 30;
            } else {
                height += 15;
            }
        });
        if (metaData.top > (this.metaData.mainHeight - height)) {
            metaData.top = this.metaData.mainHeight - height;
        }
        if (metaData.left > (this.metaData.mainWidth - width)) {
            metaData.left = this.metaData.mainWidth - width;
        }
        return metaData;
    }

    public create(metaData: IContextMetaData) {
        const newMetaData = this._calcRealSize(metaData);
        Object.assign(this.metaData, newMetaData);
        this._show = true;
    }

    public hide() {
        this._show = false;
    }

    public get show() {
        return this._show;
    }
}
