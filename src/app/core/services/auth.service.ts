import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Routes, Urls } from '../constants';
import { Router } from '@angular/router';
import { AuthUser } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login = (email: string, password: string): Observable<AuthUser> => {
    return this.http.post<AuthUser>(Urls.LOGIN, {
      email,
      password,
    });
  };

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(Urls.SIGNUP, {
      name,
      email,
      password,
    });
  }

  logout(): Observable<any> {
    return this.http.post(Urls.LOGOUT, {}).pipe(
      tap(() => {
        this.router.navigate([Routes.LOGIN]);
      }),
    );
  }
}
