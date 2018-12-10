import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GitMideaService} from 'app/common/services/git-midea.service';
import {IGroup, IProject} from '../../interfaces/git-midea.interface';
import {AbstractControl, AsyncValidatorFn, FormControl, FormGroup, Validators} from '@angular/forms';
import {DomService} from 'app/common/services/dom.service';
import {Observable, of, timer} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {ComponentsService} from '../../services/components.service';
import {IResponseInterface} from 'app/common/interfaces/response.interface';
import {Router} from '@angular/router';
import {TagsService} from '../../services/tags.service';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.less']
})
export class CreateComponent implements OnInit, OnDestroy {

    groups: IGroup[] = [];
    projects: IProject[] = [];
    existProjectsPath: string[] = [];

    @ViewChild('createProjectModal') createProjectModal: ElementRef;
    @ViewChild('tagsModal') tagsModal: ElementRef;

    mainForm = new FormGroup({
        group: new FormControl(''),
        repoId: new FormControl('', [
            Validators.required,
        ], [
            this.existCheck('repoId').bind(this),
        ]),
        componentName: new FormControl('', [
            Validators.required,
            Validators.pattern(/^(?![0-9_])[a-zA-Z0-9_]+$/),
            Validators.minLength(2),
            Validators.maxLength(30),
        ], [
            this.existCheck('componentName').bind(this),
        ]),
        title: new FormControl('', [
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9_\u4e00-\u9eff]+$/),
            Validators.minLength(2),
            Validators.maxLength(32),
        ]),
        tags: new FormControl([]),
        isPublic: new FormControl(true),
        deployType: new FormControl(2),
        description: new FormControl('', [Validators.required]),
    });

    createProject = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.pattern(/^(?![0-9_])[a-zA-Z0-9_]+$/),
            this._projectNameExist.bind(this),
        ]),
        namespace_id: new FormControl(''),
        description: new FormControl('')
    });

    existCheck(type): AsyncValidatorFn {
        return (control: AbstractControl) => {
            return timer(500).pipe(
                switchMap(() => {
                    if (!control.value) {
                        return of(null);
                    }
                    return this._componentsService.existCheck(type, control.value).pipe(
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
        };
    }

    get f() {
        return this.mainForm.controls;
    }

    get cf() {
        return this.createProject.controls;
    }

    constructor(
        public tagsService: TagsService,
        private _gitMideaService: GitMideaService,
        private _componentsService: ComponentsService,
        private _domService: DomService,
        private _tagsService: TagsService,
        private _router: Router,
    ) {
    }

    private _projectNameExist(control: AbstractControl): { [key: string]: any } | null {
        const exist = this.existProjectsPath.indexOf(control.value) >= 0;
        return exist ? {'exist': {value: control.value}} : null;
    }

    getGroups() {
        this.f.group.setValue('');
        this.groups = [];
        this._gitMideaService.projectGroups()
            .subscribe((data: IGroup[]) => {
                this.groups = data;
            });
    }

    private _getProjectsList$(groupId = ''): Observable<any> {
        this.f.repoId.setValue('');
        return groupId ?
            this._gitMideaService.getProjectsByGroup(groupId)
            : this._gitMideaService.getRootProjectsList();
    }

    getProjectsList(groupId?: string) {
        this.f.repoId.setValue('');
        this.projects = [];
        this._getProjectsList$(groupId)
            .subscribe((data: IProject[]) => {
                this.projects = data;
                if (groupId === undefined) {
                    data.map(project => this.existProjectsPath.push(project.path));
                }
            });
    }

    ngOnInit() {
        this.getGroups();
        this.getProjectsList();
        this.f.group.valueChanges.subscribe((newValue) => {
            this.getProjectsList(newValue);
        });
        this.cf.namespace_id.valueChanges.subscribe((newId) => {
            this._getProjectsList$(newId)
                .subscribe((projects: IProject[]) => {
                    this.existProjectsPath = [];
                    projects.map(project => this.existProjectsPath.push(project.path));
                    this.cf.name.updateValueAndValidity();
                });
        });
        if (this._domService.isBrowser) {
            setTimeout(() => {
                TopUI.modal(this.createProjectModal.nativeElement).show();
            }, 0);
            setTimeout(() => {
                TopUI.modal(this.tagsModal.nativeElement).show();
            }, 0);
        }
    }

    ngOnDestroy(): void {
        if (this.createProjectModal) {
            TopUI.modal(this.createProjectModal.nativeElement).$destroy(true);
        }
        if (this.tagsModal) {
            TopUI.modal(this.tagsModal.nativeElement).$destroy(true);
        }
    }

    createRepo() {
        const value = this.createProject.value;
        value['path'] = value.name;
        this._gitMideaService.createProject(value)
            .then((res: IProject) => {
                TopUI.notification('仓库创建成功！', 'success');
                this.f.group.setValue(value.namespace_id);
            })
            .catch(() => {
                TopUI.notification('仓库创建失败，该名称已经被占用或你无权限创建', 'danger');
            });
    }

    create() {
        const value = Object.assign({}, this.mainForm.value);
        delete value.group;
        value.repoId = Number(value.repoId);
        const repo = this.projects.filter(project => project.id === value.repoId)[0];
        value['repoPath'] = repo.path_with_namespace;
        value['repoBranch'] = repo.default_branch;
        console.log(value);
        this._componentsService.createComponent(value)
            .subscribe(() => {
                TopUI.notification('组件创建成功！', 'success');
                this._router.navigate(['/components/my-components']).then();
            });
    }
}
