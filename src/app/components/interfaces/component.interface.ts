import {IUserInterface} from 'src/app/user/interfaces/user.interface';

export interface IComponentInterface {
    title: string;
    componentName: string;
    createTime: string;
    isActive: boolean;
    metaData: object;
    private: boolean;
    tags: number[];
    updateTime: string;
    users: IUserInterface[];
    versions: any[];
    repoId: number;
    repoPath: string;
    repoBranch: string;
    description: string;
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
