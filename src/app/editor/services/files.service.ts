import {Injectable} from '@angular/core';
import * as FS from 'vendor/fs.js';
import * as pify from 'vendor/pify.js';
import {ITreeNode} from '../interfaces/panel.interface';
import {LoadingService} from './loading.service';

async function getFilesTree(path, fs, ignoreList, result) {
    const files = await fs.readdir(path);
    for (const file of files) {
        const realPath = path + '/' + file;
        const isIgnore = ignoreList.filter(ignoreMark => (path + '/' + ignoreMark) === realPath)[0];
        if (!isIgnore) {
            const fileStat = await fs.stat(realPath);
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
                await getFilesTree(realPath, fs, ignoreList, singleFile.children);
            }
            result.push(singleFile);
        }
    }
    return result;
}

@Injectable()
export class FilesService {

    constructor(
        private _loadingService: LoadingService,
    ) {}

    public fs;

    private options = {
        fs: 'IndexedDB',
        options: {}
    };

    init(): Promise<any> {
        this._loadingService.setState('设置文件系统');
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
        ignoreList: string[] = ['.git']
    ): Promise<ITreeNode[]> {
        const result = [];
        await getFilesTree(path, this.fs, ignoreList, result);
        return result;
    }
}
