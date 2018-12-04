import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GitMideaService} from '../../../common/services/git-midea.service';

@Component({
    selector: 'app-create-component',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
    constructor(
        private _gitMideaService: GitMideaService,
    ) {
    }

    mainForm = new FormGroup({
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
        buildCmd: new FormControl('npm run build', [Validators.required]),
        type: new FormControl('template'),
        template: new FormControl('vue-component'),
        file: new FormControl(''),
        gitRepo: new FormControl(''),
    });

    get f() {
        return this.mainForm.controls;
    }

    injectValidateRulesBaseOnType(type) {
        if (type === 'upload') {
            this.f.file.setValidators(Validators.required);
        } else {
            this.f.file.clearValidators();
        }
        if (type === 'git') {
            this.f.gitRepo.setValidators([
                Validators.required,
                Validators.pattern(/(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/),
            ]);
        } else {
            this.f.gitRepo.clearValidators();
        }
        this.f.gitRepo.updateValueAndValidity({
            onlySelf: true,
        });
        this.f.file.updateValueAndValidity({
            onlySelf: true,
        });
    }

    ngOnInit() {
        this.f.type.valueChanges
            .subscribe(this.injectValidateRulesBaseOnType.bind(this));
        this._gitMideaService.getProjectsList()
            .subscribe(data => {
                console.log('data');
                console.log(data);
            });
        this._gitMideaService.user()
            .then(data => {
                console.log('users');
                console.log(data);
            });
        this._gitMideaService.groups()
            .subscribe(data => {
                console.log('groups');
                console.log(data);
            });
    }

    create() {
        TopUI.notification('123123');
    }
}