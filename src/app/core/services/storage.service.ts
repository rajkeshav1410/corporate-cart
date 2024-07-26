import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthUser } from '../models';
import { AuthService } from './auth.service';
import { StringConstants } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _userData = new BehaviorSubject<AuthUser | null>(null);

  public readonly userData = this._userData.asObservable();

  constructor(private authService: AuthService) {}

  clean(): void {
    this._userData.next(null);
    window.sessionStorage.clear();
  }

  public saveUser(user: AuthUser): void {
    this._userData.next(user);
    window.sessionStorage.removeItem(StringConstants.USER_KEY);
    window.sessionStorage.setItem(
      StringConstants.USER_KEY,
      JSON.stringify(user),
    );
  }

  public getUser(): AuthUser | null {
    const user = window.sessionStorage.getItem(StringConstants.USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  public refreshUser() {
    this.authService.profile().subscribe({
      next: (user: AuthUser) => {
        this.saveUser(user);
      },
    });
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(StringConstants.USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }
}
