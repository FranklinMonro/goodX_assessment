import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from './auth.service';
import { LogInAuthUser } from './auth.models';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  standalone: true,
})
export class AuthComponent implements OnInit {
  
  loadingSpinner: boolean = false;

  loginForm: FormGroup | undefined

  show: boolean = false;

  private formBuilder: FormBuilder = inject(FormBuilder); 
  private authService: AuthService =  inject(AuthService);
  private toastrService: ToastrService = inject(ToastrService);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.createLogInForm();
  }

  private createLogInForm = (): void => {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  };

  public onLogin = (): void => {
    if (this.loginForm?.invalid) {
      this.toastrService.warning('Check that all required fields are filled in', 'WARNING');
      return;
    }
    this.loadingSpinner = true;
    this.authService.postLogIn(this.loginForm?.value).subscribe({
      next: (response: HttpResponse<LogInAuthUser>) => {
        this.loadingSpinner = false;
        if (response.status === 200) {
          this.router.navigate(['/home']);
          this.toastrService.success('Log In', 'SUCCESS');
          return;
        }
        this.toastrService.warning('Something went wrong in log in', 'WARNING');
      },
      error: (error: ErrorEvent) => {
        console.error(error);
        this.loadingSpinner = false;
        if (error.message.includes('404')) {
          this.toastrService.warning('Log in details is incorrect', 'WARNING');
          return;
        }
        this.toastrService.error(`Error in login, error: ${error.message}`, 'ERROR')
      },
      complete: () => {
        console.info('Login completed');
        this.loadingSpinner = false;
      }
    })
  };

  public onRegister = (): void => {
    if (this.loginForm?.invalid) {
      this.toastrService.warning('Check that all required fields are filled in', 'WARNING');
      return;
    }
    this.loadingSpinner = true;
    this.authService.postRegister(this.loginForm?.value).subscribe({
      next: (response: HttpResponse<LogInAuthUser>) => {
        this.loadingSpinner = false;
        if (response.status === 201) {
          this.toastrService.success('User has been register', 'SUCCESS');
          return;
        }
        this.toastrService.warning('User has not been register', 'WARNING');
      },
      error: (error: Error) => {
        console.error(error);
        this.loadingSpinner = false;
        if (error.message.includes('303')) {
          this.toastrService.warning('User already exists', 'WARNING');
          return;
        }
        this.toastrService.error(`Error in register, error: ${error.message}`, 'ERROR')
      },
      complete: () => {
        console.info('Register completed')
        this.loadingSpinner = false;
      }
    })
  }
}
