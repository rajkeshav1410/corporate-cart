import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Routes, API } from '../constants';
import { Router } from '@angular/router';
import { AuthUser, VoidResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Constructor for AuthService.
   * @param {HttpClient} http - The HttpClient instance for making HTTP requests.
   * @param {Router} router - The Router instance for navigation.
   */
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  /**
   * Performs user login with the provided email and password.
   * @param {string} email - The user's email for login.
   * @param {string} password - The user's password for login.
   * @returns {Observable<AuthUser>} - An Observable of the authenticated user.
   */
  login = (email: string, password: string): Observable<AuthUser> =>
    this.http.post<AuthUser>(API.LOGIN, {
      email,
      password,
    });

  /**
   * Retrieves the profile of the authenticated user.
   * @returns {Observable<AuthUser>} - An Observable of the authenticated user's profile.
   */
  profile = (): Observable<AuthUser> => this.http.get<AuthUser>(API.PROFILE);

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
        this.router.navigate([Routes.LOGIN]);
      }),
    );
}
