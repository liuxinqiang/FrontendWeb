export interface ITag {
    createTime: string;
    updateTime: string;
    name: string;
    id: number;
    selected?: boolean;
    children: ITag[];
}

export interface ITagSimple {
    name: string;
    id: number;
}
