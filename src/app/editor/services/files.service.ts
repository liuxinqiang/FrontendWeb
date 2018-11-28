import {Injectable} from '@angular/core';
import * as FS from 'vendor/fs.js';
import * as pify from 'vendor/pify.js';
import {IGetTreeMode, ITreeNode} from '../interfaces/panel.interface';

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

    async readTextFile(path): Promise<string> {
        return this.fs.readFile(path)
            .then(data => data.toString());
    }

    async writeTextFile(path, content): Promise<boolean> {
        return this.fs.writeFile(path, content, 'utf-8');
    }

    async getTree(
        path: string,
        result = [],
        mode: IGetTreeMode = 'tree',
        ignoreList: string[] = ['.git']
    ): Promise<ITreeNode[] | string[]> {
        const files = await this.fs.readdir(path);
        files.forEach(async (file) => {
            const realPath = path + '/' + file;
            if (ignoreList.filter(ignoreMark => (path + '/' + ignoreMark) === realPath).length) {
                return;
            }
            const fileStat = await this.fs.stat(realPath);
            if (mode === 'tree') {
                const singleFile: ITreeNode = {
                    file,
                    size: fileStat.size,
                    url: `file://local/${realPath}`,
                    path: realPath,
                    ext: file.substr(file.lastIndexOf('.') + 1),
                    isDirectory: false,
                    active: false,
                    opened: false,
                    children: [],
                };
                if (fileStat.isDirectory()) {
                    singleFile.isDirectory = true;
                    singleFile.ext = '';
                    await this.getTree(realPath, singleFile.children, mode, ignoreList);
                }
                result.push(singleFile);
            } else {
                if (fileStat.isDirectory()) {
                    result = await this.getTree(realPath, result);
                } else {
                    result.push(realPath);
                }
            }
        });
        return result;
    }
}
