import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomHttpErrorResponse } from '../../models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
  });

  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit = () => {
    const { email, password } = this.loginForm.value;
    this.error = '';

    if (this.loginForm.valid) {
      this.authService.login(email!, password!).subscribe({
        next: (response) => {
          this.router.navigate(['']);
        },
        error: (error: CustomHttpErrorResponse) => {
          console.log(error)
          this.error = error.error.message;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  };
}
