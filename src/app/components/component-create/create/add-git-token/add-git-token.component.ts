import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../../user/services/user.service';

@Component({
    selector: 'app-add-git-token',
    templateUrl: './add-git-token.component.html',
    styleUrls: ['./add-git-token.component.less']
})
export class AddGitTokenComponent implements OnChanges {
    @Input() type = 'github';

    @ViewChild('addTokenModal') addTokenModal: ElementRef;

    @Output() tokenUpdate: EventEmitter<void> = new EventEmitter();

    typesMap = {
        github: {
            name: 'Github',
            url: 'https://github.com/settings/tokens',
            description: '',
        },
        mideaGit: {
            name: 'Git Midea',
            url: 'http://git.midea.com/profile/personal_access_tokens',
            description: '',
        },
    };

    addTokenForm = new FormGroup({
        token: new FormControl('', [
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9]+$/),
            Validators.minLength(10),
            Validators.maxLength(40),
        ]),
    });

    get f() {
        return this.addTokenForm.controls;
    }

    save() {
        const data = {
            tokens: {},
        };
        data.tokens[this.type] = this.addTokenForm.value.token;
        this._userService.updateUser(data)
            .subscribe(() => {
                TopUI.notification('更新成功！', 'success');
                TopUI.modal(this.addTokenModal.nativeElement).hide();
                this.tokenUpdate.emit();
            });
    }

    constructor(
        private _userService: UserService,
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.type) {
            this.addTokenForm.reset();
        }
    }

}
