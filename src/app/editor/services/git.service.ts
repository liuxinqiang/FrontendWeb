import {Injectable} from '@angular/core';
import * as git from 'vendor/git.js';
import {FilesService} from './files.service';

@Injectable()
export class GitService {

    constructor(
        private _filesService: FilesService,
    ) {
    }

    async initGit(): Promise<any[]> {
        const [fs, pfs] = await this._filesService.init();
        git.plugins.set('fs', fs);
        const dir = 'liuxinqiang_components_test';
        // await pfs.mkdir(dir);
        await pfs.readdir(dir);
        await git.clone({
            dir,
            url: 'https://git-midea.liuxinqiang.com/async-components/FormDesignerCustomServiceTemplate.git',
            ref: 'master',
            singleBranch: true,
            depth: 10
        });
        return await pfs.readdir(dir);
    }
}
