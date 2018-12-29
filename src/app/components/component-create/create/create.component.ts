import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {DomService} from 'app/common/services/dom.service';
import {Observable, of, timer} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {ComponentsService} from '../../services/components.service';
import {IResponseInterface} from 'app/common/interfaces/response.interface';
import {Router} from '@angular/router';
import {TagsService} from '../../services/tags.service';
import {UserService} from '../../../user/services/user.service';
import * as gitParser from 'parse-github-url';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.less']
})
export class CreateComponent implements OnInit {

    public availableTokensList;

    mainForm = new FormGroup({
        componentId: new FormControl('', [
            Validators.required,
            Validators.pattern(/^(?![0-9_])[a-z0-9_]+$/),
            Validators.minLength(2),
            Validators.maxLength(30),
        ], [
            this.componentIdExistCheck.bind(this),
        ]),
        name: new FormControl('', [
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9_\u4e00-\u9eff]+$/),
            Validators.minLength(2),
            Validators.maxLength(32),
        ]),
        tags: new FormControl([]),
        isPublic: new FormControl(true),
        description: new FormControl('', [Validators.required]),
        dataSourceType: new FormControl('github'), // mideaGit | github | upload
        gitRepoPath: new FormControl(''),
        enableSync: new FormControl(false),
        uploadFile: new FormControl(null),
    });

    componentIdExistCheck(control: AbstractControl): Observable<ValidationErrors | null> {
        return timer(500)
            .pipe(
                switchMap(() => {
                    if (!control.value) {
                        return of(null);
                    }
                    return this._componentsService.componentIdExist(control.value).pipe(
                        map((res: IResponseInterface) => {
                            if (res.data === null) {
                                return null;
                            } else {
                                return {
                                    exist: true,
                                };
                            }
                        }),
                        catchError(() => of({
                            exist: true,
                        }))
                    );
                })
            );
    }

    injectValidateRulesBaseOnType(type) {
        if (type === 'upload') {
            this.f.uploadFile.setValidators(Validators.required);
            this.f.gitRepoPath.clearValidators();
        } else {
            this.f.gitRepoPath.setValidators([
                Validators.required,
                Validators.pattern(/(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/),
                this.gitRepoValidator,
            ]);
            this.f.uploadFile.clearValidators();
        }
        this.f.uploadFile.reset();
        this.f.gitRepoPath.reset();
        this.f.gitRepoPath.updateValueAndValidity({
            onlySelf: true,
        });
        this.f.uploadFile.updateValueAndValidity({
            onlySelf: true,
        });
    }

    gitRepoValidator(control: AbstractControl) {
        const paredUrl = gitParser(control.value);
        return (paredUrl && paredUrl.repo) ? null : {
            'repoError': true,
        };
    }

    get f() {
        return this.mainForm.controls;
    }

    constructor(
        private _componentsService: ComponentsService,
        private _domService: DomService,
        private _tagsService: TagsService,
        private _userService: UserService,
        private _router: Router,
        private cd: ChangeDetectorRef,
    ) {
    }

    create() {
        const value = Object.assign({}, this.mainForm.value);
        console.log(gitParser(value.gitRepoPath));
        if (1 > 0) {
            return;
        }
        this._componentsService.createComponent(value)
            .subscribe(() => {
                TopUI.notification('组件创建成功！', 'success');
                this._router.navigate(['/components/my-components']).then();
            });
    }

    calcTokenAvailable() {
        return this.availableTokensList && this.availableTokensList.includes(this.f.dataSourceType.value);
    }

    getTokensList() {
        this._userService.getUserAvailableTokens()
            .subscribe(data => {
                this.availableTokensList = data;
            });
    }

    ngOnInit(): void {
        this.injectValidateRulesBaseOnType(this.f.dataSourceType.value);
        this.f.dataSourceType.valueChanges
            .subscribe(this.injectValidateRulesBaseOnType.bind(this));
        this.getTokensList();
    }
}
