export interface ITag {
    createTime: string;
    updateTime: string;
    name: string;
    id: number;
    children: ITag[];
}
