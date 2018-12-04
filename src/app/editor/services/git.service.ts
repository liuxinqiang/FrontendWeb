import {Injectable} from '@angular/core';
import * as git from 'vendor/git.js';
import {FileService} from './file.service';
import {LoadingService, LoadingState} from './loading.service';
import {AuthService} from 'app/user/services/auth.service';
import {environment} from 'environments/environment';
import {ComponentDetailStorage, IComponentInterface} from '../../components/interfaces/component.interface';
import {GitMideaService} from 'app/common/services/git-midea.service';
import {LocalStorageService} from 'app/common/services/local-storage.service';
import {DirExistsMethod} from '../methods/dir-exists.method';
import {ForceDeleteForlder} from '../methods/rm-rf.method';
import {ComponentService} from './component.service';

@Injectable()
export class GitService {

    constructor(
        private _fileService: FileService,
        private _authService: AuthService,
        private _loadingService: LoadingService,
        private _gitMideaService: GitMideaService,
        private _localStorage: LocalStorageService,
        private _componentService: ComponentService,
    ) {}

    public projectDir: string;

    public projectUrl: string;

    public get authInfo(): object {
        return {
            oauth2format: 'gitlab',
            token: this._authService.currentUserValue.user.authTokens.gitMidea.token,
        };
    }

    async init(): Promise<void> {
        const component: IComponentInterface = this._componentService.component;
        this.projectDir = `${this._authService.currentUserValue.user.loginName}_component_${component.componentName}`;
        this.projectUrl = `${environment.gitMidea.url}/${component.repo.gitMidea.path}.git`;
        const componentStorage: ComponentDetailStorage = this._localStorage.getItem(this.projectDir)
            || new ComponentDetailStorage();

        const fs = this._fileService.fs;
        this._loadingService.setState({
            state: LoadingState.loading,
            message: '设置代码仓库',
        });
        git.plugins.set('fs', fs);
        let exist = await DirExistsMethod(this.projectDir, fs);
        if (exist && !componentStorage.initComplete) {
            await ForceDeleteForlder(this.projectDir, fs);
            exist = false;
        }
        if (!exist) {
            await fs.mkdir(this.projectDir);
            await git.clone({
                ...this.authInfo,
                dir: this.projectDir,
                url: this.projectUrl,
                ref: component.repo.gitMidea.branch,
                singleBranch: true,
                depth: 5
            });
        }
        componentStorage.initComplete = true;
        this._localStorage.setItem(this.projectDir, componentStorage);
    }
}
