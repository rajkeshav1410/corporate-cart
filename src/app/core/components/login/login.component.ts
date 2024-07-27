import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { Router, RouterModule } from '@angular/router';

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
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  // Form group for login details
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
  });

  // Flag to toggle password visibility
  hide: boolean = true;

  // Error message holder
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  /**
   * Initialization lifecycle hook
   */
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) this.router.navigate(['']);
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility = () => {
    this.hide = !this.hide;
  };

  /**
   * Handle form submission for login
   */
  onSubmit = () => {
    const { email, password } = this.loginForm.value;
    this.error = '';

    if (this.loginForm.valid) {
      this.authService.login(email!, password!).subscribe({
        error: (error: Error) => {
          this.error = error.message;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  };
}
