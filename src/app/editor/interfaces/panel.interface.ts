export type INavPanelType = 'files' | 'search' | 'config' | 'deploy' | null;

export interface ITreeNode {
    file: string;
    path:  string;
    url?: string;
    size?: number;
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
