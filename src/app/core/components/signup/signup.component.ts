import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomHttpErrorResponse } from '../../models';
import { AuthService, NotificationService } from '../../services';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { StringConstants } from '@app/core/constants';

@Component({
  selector: 'app-signup',
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
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  //Signup form group with name, email, and password fields
  signupForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(/\s/),
      Validators.minLength(3),
      Validators.maxLength(16),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  // Controls password visibility
  hide: boolean = true;

  // Error message displayed to the user
  error: string = '';

  /**
   * Constructor for SignupComponent
   * @param authService - Authentication service
   * @param notificationService - Notification service
   */
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility = () => {
    this.hide = !this.hide;
  };

  /**
   * Handle form submission
   */
  onSubmit = () => {
    const { name, email, password } = this.signupForm.value;
    this.error = '';

    if (this.signupForm.valid) {
      this.authService.register(name!, email!, password!).subscribe({
        next: () => {
          this.authService.login(email!, password!).subscribe({
            next: () =>
              this.notificationService.success(
                StringConstants['success.signup'],
              ),
            error: this.errorHandler,
          });
        },
        error: this.errorHandler,
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  };

  /**
   * Handle HTTP error responses
   * @param {CustomHttpErrorResponse} error - Custom HTTP error response
   */
  errorHandler = (error: CustomHttpErrorResponse) => {
    this.error = error.error.message;
  };
}
