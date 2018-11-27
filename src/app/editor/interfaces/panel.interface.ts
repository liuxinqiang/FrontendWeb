export type INavPanelType = 'files' | 'search' | 'config' | 'deploy' | null;

export type IGetTreeMode = 'tree' | 'directories';

export interface ITreeNode {
    file: string;
    path:  string;
    ext?: string;
    active?: boolean;
    opened?: boolean;
    isDirectory?: boolean;
    children?: ITreeNode[];
}

export interface IActiveFilesStorage {
    file: string;
    list: string[];
}
