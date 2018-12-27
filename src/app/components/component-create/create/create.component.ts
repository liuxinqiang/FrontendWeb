import {Component} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
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
export class CreateComponent {

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
        gitRepoPath: new FormControl('', [Validators.required]),
        enableSync: new FormControl(false),
        uploadFile: new FormControl(null, [Validators.required]),
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

    get f() {
        return this.mainForm.controls;
    }

    constructor(
        private _componentsService: ComponentsService,
        private _domService: DomService,
        private _tagsService: TagsService,
        private _router: Router,
    ) {
    }

    onUploadChange(event) {}

    create() {
        const value = Object.assign({}, this.mainForm.value);
        this._componentsService.createComponent(value)
            .subscribe(() => {
                TopUI.notification('组件创建成功！', 'success');
                this._router.navigate(['/components/my-components']).then();
            });
    }
}
