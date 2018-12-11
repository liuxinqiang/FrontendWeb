export interface ITag {
    createTime?: string;
    updateTime?: string;
    name: string;
    id?: number;
    children?: ITag[];
    // editing Mode
    selected?: boolean;
    editing?: boolean;
    parentId?: number;
}

export interface ITagSimple {
    name: string;
    id?: number;
}
