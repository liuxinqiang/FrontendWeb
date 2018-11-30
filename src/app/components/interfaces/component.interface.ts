import {IUserInterface} from 'app/common/interfaces/user.interface';

export interface IComponentRepoInterface {
    gitMidea?: {
        path: string;
        id: number;
    };
}

export interface IComponentInterface {
    name: string;
    componentName: string;
    createTime: string;
    isActive: boolean;
    metaData: object;
    private: boolean;
    tags: number[];
    updateTime: string;
    users: IUserInterface[];
    versions: any[];
    repo: IComponentRepoInterface;
}
