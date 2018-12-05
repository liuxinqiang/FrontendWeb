import {Injectable} from '@angular/core';
import {clone, plugins} from 'vendor/git.js';
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

    public dir: string;

    public url: string;

    public get authInfo(): object {
        return {
            oauth2format: 'gitlab',
            token: this._authService.currentUserValue.user.authTokens.gitMidea.token,
        };
    }

    async init(): Promise<void> {
        const component: IComponentInterface = this._componentService.component;
        this.dir = `${this._authService.currentUserValue.user.loginName}_component_${component.componentName}`;
        this.url = `${environment.gitMidea.url}/${component.repo.gitMidea.path}.git`;
        const componentStorage: ComponentDetailStorage = this._localStorage.getItem(this.dir)
            || new ComponentDetailStorage();

        const fs = this._fileService.fs;
        this._loadingService.setState({
            state: LoadingState.loading,
            message: '设置代码仓库',
        });
        plugins.set('fs', fs);
        let exist = await DirExistsMethod(this.dir, fs);
        if (exist && !componentStorage.initComplete) {
            await ForceDeleteForlder(this.dir, fs);
            exist = false;
        }
        if (!exist) {
            await fs.mkdir(this.dir);
            await clone({
                ...this.authInfo,
                dir: this.dir,
                url: this.url,
                ref: component.repo.gitMidea.branch,
                singleBranch: true,
                depth: 5
            });
        }
        componentStorage.initComplete = true;
        this._localStorage.setItem(this.dir, componentStorage);
    }
}
