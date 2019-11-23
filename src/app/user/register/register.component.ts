import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {IUserInterface} from '../interfaces/user.interface';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {of, timer} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {IResponseInterface} from '../../common/interfaces/response.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent {
  existedUserInfo: IUserInterface = null;

  registerInfo = this.fb.group({
    name: ['', [Validators.required]],
    username: ['', [
      Validators.required,
      Validators.minLength(4),
    ], [
      this.validateUsername.bind(this),
    ]],
    avatar: ['', [Validators.required]],
    email: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validator: this.passwordConfirming,
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
  }

  get r() {
    return this.registerInfo.controls;
  }

  getConfirmPasswordError() {
    return this.r.password.touched
      && this.r.confirmPassword.touched
      && !this.r.confirmPassword.errors
      && this.registerInfo.hasError('notMatch');
  }

  validateUsername(control: AbstractControl) {
    this.existedUserInfo = null;
    return timer(500).pipe(
      switchMap(() => {
        if (!control.value) {
          return of(null);
        }
        return this.authService.simpleUserInfo(control.value).pipe(
          map((result: IResponseInterface) => {
            const data: IUserInterface = result.data;
            this.existedUserInfo = data;
            return {
              existedUser: data.name,
            };
          }),
          catchError(() => of(null))
        );
      })
    );
  }

  passwordConfirming(c: AbstractControl): { notMatch: boolean } {
    if (c.get('password').value !== c.get('confirmPassword').value) {
      return {notMatch: true};
    }
  }

  register() {
    const userInfo = this.registerInfo.value;
    delete userInfo.confirmPassword;
    this.authService.register({
      ...userInfo,
    })
      .subscribe(() => {
        UIkit.notification({
          message: '注册成功，请登录',
          status: 'success',
        });
        this.router.navigate(['/user/login'], {
          queryParams: {
            username: userInfo.username,
          }
        }).then();
      });
  }
}
