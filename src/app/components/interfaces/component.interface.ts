import {IUserInterface} from 'app/common/interfaces/user.interface';

export interface IRepoInfo {
    branch: string;
    path: string;
    id: number;
}

export interface IComponentRepoInterface {
    gitMidea?: IRepoInfo;
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

export class ComponentDetailStorage {
    constructor(initComplete = false, openedFiles = [], currentActiveFile = '') {
        this.initComplete = initComplete;
        this.openedFiles = openedFiles;
        this.currentActiveFile = currentActiveFile;
    }

    initComplete: boolean;
    openedFiles: string[];
    currentActiveFile: string;
}