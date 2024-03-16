import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { Auth, LogInAuthUser } from './auth.interface';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  loginForm: FormGroup | undefined

  show: boolean = false;

  load: boolean = false;
  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    ) {
    this.createLogInForm();
  }

  private createLogInForm = (): void => {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  };

  public onSubmit = (): void => {
    if (this.loginForm?.invalid) {
      return;
    }
    this.load = true;
    this.authService.postLogIn(this.loginForm?.value).subscribe({
      next: (status: number) => {
        if (status === 200) {
          this.router.navigate(['/home']);
          this.toastrService.success('Log In', 'SUCCESS');
          return;
        }
        this.toastrService.warning('Log in details is incorrect', 'WARNING');
      },
      error: (error: ErrorEvent) => {
        this.load = false;
        if (error.message.includes('404')) {
          this.toastrService.warning('Log in details is incorrect', 'WARNING');
          return;
        }
        this.toastrService.error(`Error in login, error: ${error.message}`, 'ERROR')
      },
      complete: () => {
        this.load = false;
      }
    })
  };
}
