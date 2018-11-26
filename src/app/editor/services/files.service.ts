import {Injectable} from '@angular/core';
import * as FS from 'vendor/fs.js';
import * as pify from 'vendor/pify.js';

export type IGetTreeMode = 'tree' | 'directories';

export interface ITreeNode {
    file: string;
    path: string;
    ext: string;
    isDirectory: boolean;
    children: ITreeNode[];
}

@Injectable()
export class FilesService {

    public fs;

    private options = {
        fs: 'IndexedDB',
        options: {}
    };

    init(): Promise<any> {
        return new Promise((resolve, reject) => {
            FS.configure(this.options, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                const fs = FS.BFSRequire('fs');
                this.fs = pify(fs);
                resolve(fs);
            });
        });
    }

    async getTree(path: string, result = [], mode: IGetTreeMode = 'tree'): Promise<ITreeNode[] | string[]> {
        const files = await this.fs.readdir(path);
        files.forEach(async (file) => {
            const fileStat = await this.fs.stat(path + '/' + file);
            if (mode === 'tree') {
                const singleFile: ITreeNode = {
                    file,
                    path: path + '/' + file,
                    ext: file.substr(file.lastIndexOf('.') + 1),
                    isDirectory: false,
                    children: [],
                };
                if (fileStat.isDirectory()) {
                    singleFile.isDirectory = true;
                    singleFile.ext = '';
                    await this.getTree(path + '/' + file, singleFile.children, mode);
                }
                result.push(singleFile);
            } else {
                if (fileStat.isDirectory()) {
                    result = await this.getTree(path + '/' + file, result);
                } else {
                    result.push(path + '/' + file);
                }
            }
        });
        return result;
    }
}
