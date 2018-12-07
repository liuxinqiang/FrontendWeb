import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GitMideaService} from '../../../common/services/git-midea.service';
import {IGroup, IProject} from '../../interfaces/git-midea.interface';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {DomService} from '../../../common/services/dom.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.less']
})
export class CreateComponent implements OnInit {

    groups: IGroup[] = [];
    projects: IProject[] = [];
    existProjectsPath: string[] = [];

    @ViewChild('createButton') createButton: ElementRef;

    mainForm = new FormGroup({
        group: new FormControl(''),
        project: new FormControl('', [
            Validators.required,
        ]),
        title: new FormControl('', [
            Validators.required,
            Validators.pattern(/^[a-z0-9_\u4e00-\u9eff]+$/),
            Validators.minLength(2),
            Validators.maxLength(32),
        ]),
        name: new FormControl('', [
            Validators.required,
            Validators.pattern(/^(?![0-9_])[a-zA-Z0-9_]+$/),
            Validators.minLength(2),
            Validators.maxLength(30),
        ]),
        version: new FormControl('1.0.0', [
            Validators.required,
            Validators.pattern(/^\d{1,3}\.\d{1,3}\.\d{1,3}$/),
        ]),
        description: new FormControl('功能1\n功能2\n功能3', [Validators.required]),
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

    get f() {
        return this.mainForm.controls;
    }

    get cf() {
        return this.createProject.controls;
    }

    constructor(
        private _gitMideaService: GitMideaService,
        private _domService: DomService,
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
        this.f.project.setValue('');
        return groupId ?
            this._gitMideaService.getProjectsByGroup(groupId)
            : this._gitMideaService.getRootProjectsList();
    }

    getProjectsList(groupId?: string) {
        this.f.project.setValue('');
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
                TopUI.toggle(this.createButton.nativeElement).toggle();
            }, 0);
        }
    }

    create() {
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
}
