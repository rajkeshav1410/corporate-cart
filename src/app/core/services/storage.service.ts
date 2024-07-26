import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthUser } from '../models';
import { AuthService } from './auth.service';
import { StringConstants } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  // The private BehaviorSubject for storing user data, initialized with null
  private _userData = new BehaviorSubject<AuthUser | null>(null);

  /**
   * Observable stream of user data for external access.
   */
  public readonly userData = this._userData.asObservable();

  constructor(private authService: AuthService) {}

  /**
   * Clears user data from storage and session storage.
   */
  clean(): void {
    this._userData.next(null);
    window.sessionStorage.clear();
  }

  /**
   * Saves the provided user data to session storage.
   * @param {AuthUser} user - The user data to be saved.
   */
  public saveUser(user: AuthUser): void {
    this._userData.next(user);
    window.sessionStorage.removeItem(StringConstants.USER_KEY);
    window.sessionStorage.setItem(
      StringConstants.USER_KEY,
      JSON.stringify(user),
    );
  }

  /**
   * Retrieves the user data from session storage.
   * @returns {AuthUser | null} - The user data if found, or null.
   */
  public getUser(): AuthUser | null {
    const user = window.sessionStorage.getItem(StringConstants.USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  /**
   * Refreshes the user data by fetching the latest profile from the server.
   */
  public refreshUser() {
    this.authService.profile().subscribe({
      next: (user: AuthUser) => {
        this.saveUser(user);
      },
    });
  }

  /**
   * Checks if a user is logged in by checking session storage for user data.
   * @returns {boolean} - True if a user is logged in, otherwise false.
   */
  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(StringConstants.USER_KEY);
    return !!user;
  }
}
