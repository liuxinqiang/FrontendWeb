export interface IFile {
    id: string;
    type: 'file' | 'directory';
    _id?: string;
    _rev?: string;
    name?: string;
    content?: string;
    extension?: string;
    mime?: string | null;
    path?: string;
    size?: number;
    active?: boolean;
    opened?: boolean;
    children?: IFile[];
}
