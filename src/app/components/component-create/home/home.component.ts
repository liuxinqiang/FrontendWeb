import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import * as FS from 'vendor/fs.js';
import * as pify from 'vendor/pify.js';
import * as git from 'vendor/git.js';

@Component({
    selector: 'app-create-component',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
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

    initGit() {
        const fsOptions = {
            fs: 'IndexedDB',
            options: {}
        };
        FS.configure(fsOptions, async function (err) {
            const fs = FS.BFSRequire('fs');
            git.plugins.set('fs', fs);
            const pfs = pify(fs);

            const dir = 'liuxinqiang_components_test'
            // await pfs.mkdir(dir);
            await pfs.readdir(dir);
            await git.clone({
                dir,
                url: 'https://git-midea.liuxinqiang.com/async-components/FormDesignerCustomServiceTemplate.git',
                ref: 'master',
                singleBranch: true,
                depth: 10
            });
            const test = await pfs.readdir(dir);
            console.log(test);
        });
    }

    ngOnInit() {
        this.f.type.valueChanges
            .subscribe(this.injectValidateRulesBaseOnType.bind(this));
        this.initGit();

    }

    create() {
        TopUI.notification('123123');
    }
}
