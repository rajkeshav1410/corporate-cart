import { Location, NgIf } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
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
import { AuthService, StorageService } from '../../services';
import { CustomHttpErrorResponse } from '../../models';
import { Router } from '@angular/router';

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
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
  });

  hide: boolean = true;

  error: string = '';

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private location: Location,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) this.router.navigate(['']);
  }

  togglePasswordVisibility = () => {
    this.hide = !this.hide;
  };

  onSubmit = () => {
    const { email, password } = this.loginForm.value;
    this.error = '';

    if (this.loginForm.valid) {
      this.authService.login(email!, password!).subscribe({
        next: (response) => {
          this.storageService.saveUser(response);
          this.location.back();
        },
        error: (error: CustomHttpErrorResponse) => {
          console.log(error);
          this.error = error.error.message;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  };
}
