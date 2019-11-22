import {IUserInterface} from 'src/app/user/interfaces/user.interface';

export interface IResponseInterface {
    statusCode: number;
    data: any;
    message: string;
    error: string;
    dataFilter: DataFilter;
    info: object;
}

export interface ILoginResponseInterface extends IResponseInterface{
    data: ILoginUserInterface;
}

export interface ILoginUserInterface {
    token: string;
    user: IUserInterface;
}

export class DataFilter {
    pageSize: number;
    pageIndex: number;
    total = 0;
    keyWord: string;
    tags: number[];
    constructor(pageIndex = 1, pageSize = 10, total = 0) {
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.total = total;
    }
}
