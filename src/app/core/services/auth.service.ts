import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Routes, API } from '../constants';
import { Router } from '@angular/router';
import { AuthUser, CustomHttpErrorResponse, VoidResponse } from '../models';
import { Location } from '@angular/common';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // The private BehaviorSubject for storing user data, initialized with null
  private _userData = new BehaviorSubject<AuthUser | null>(null);

  /**
   * Observable stream of user data for external access.
   */
  public readonly userData = this._userData.asObservable();

  /**
   * Constructor for AuthService.
   * @param {HttpClient} http - The HttpClient instance for making HTTP requests.
   * @param {Router} router - The Router instance for navigation.
   */
  constructor(
    private http: HttpClient,
    private router: Router,
    private location: Location,
    private notificationService: NotificationService,
  ) {}

  /**
   * Saves the provided user data.
   * @param {AuthUser} user - The user data to be saved.
   */
  public setUser(user: AuthUser | null): void {
    this._userData.next(user);
  }

  getUser = () => this._userData.getValue();

  /**
   * Performs user login with the provided email and password.
   * @param {string} email - The user's email for login.
   * @param {string} password - The user's password for login.
   * @returns {Observable<AuthUser>} - An Observable of the authenticated user.
   */
  login = (email: string, password: string): Observable<AuthUser> =>
    this.http
      .post<AuthUser>(API.LOGIN, {
        email,
        password,
      })
      .pipe(
        tap({
          next: (user: AuthUser) => {
            this.setUser(user);
            this.location.back();
          },
          error: (error: CustomHttpErrorResponse) => {
            throw new Error(error.error.message);
          },
        }),
      );

  /**
   * Refreshes the user data by fetching the latest profile from the server.
   */
  verify = async (): Promise<boolean> => {
    if (this.isLoggedIn()) return true;

    return new Promise<boolean>((resolve) => {
      this.http.get<AuthUser>(API.PROFILE).subscribe({
        next: (user: AuthUser) => {
          this.setUser(user);
          resolve(true);
        },
        error: () => {
          resolve(false);
        },
      });
    });
  };

  /**
   * Registers a new user with the provided name, email, and password.
   * @param {string} name - The name of the new user.
   * @param {string} email - The email of the new user.
   * @param {string} password - The password of the new user.
   * @returns {Observable<VoidResponse>} - An Observable for the registration response.
   */
  register = (
    name: string,
    email: string,
    password: string,
  ): Observable<VoidResponse> =>
    this.http.post(API.SIGNUP, {
      name,
      email,
      password,
    });

  /**
   * Logs out the authenticated user.
   * @returns {Observable<VoidResponse>} - An Observable for the logout response.
   */
  logout = (): Observable<VoidResponse> =>
    this.http.post(API.LOGOUT, {}).pipe(
      tap(() => {
        this.setUser(null);
        this.router.navigate([Routes.LOGIN]);
      }),
    );

  /**
   * Checks if a user is logged in by checking session storage for user data.
   * @returns {boolean} - True if a user is logged in, otherwise false.
   */
  isLoggedIn = (): boolean => {
    const user = this._userData.getValue();
    return !!user;
  };
}
