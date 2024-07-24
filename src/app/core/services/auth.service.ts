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
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login = (email: string, password: string): Observable<AuthUser> =>
    this.http.post<AuthUser>(API.LOGIN, {
      email,
      password,
    });

  profile = (): Observable<AuthUser> => this.http.get<AuthUser>(API.PROFILE);

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

  logout = (): Observable<VoidResponse> =>
    this.http.post(API.LOGOUT, {}).pipe(
      tap(() => {
        this.router.navigate([Routes.LOGIN]);
      }),
    );
}
