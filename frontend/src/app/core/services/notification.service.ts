import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NumberConstants } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private readonly snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {}

  /**
   * Displays a success notification message.
   * @param {string} message - The success message to display.
   * @param {number} duration - (Optional) The duration for the notification display.
   */
  success(message: string, duration?: number) {
    this.openSnackBar(
      message,
      '',
      'success-snackbar',
      duration ?? NumberConstants.NOTIF_TIMEOUT,
    );
  }

  /**
   * Displays an error notification message.
   * @param {string} message - The error message to display.
   * @param {number} duration - (Optional) The duration for the notification display.
   */
  error(message: string, duration?: number) {
    this.openSnackBar(
      message,
      '',
      'error-snackbar',
      duration ?? NumberConstants.NOTIF_TIMEOUT,
    );
  }

  /**
   * Opens a snack bar notification with the provided settings.
   * @param {string} message - The message to display in the snack bar.
   * @param {string} action - The action text for the snack bar (e.g., button text).
   * @param {string} className - (Optional) Additional CSS class for styling the snack bar.
   * @param {number} duration - (Optional) The duration for the notification display.
   */
  openSnackBar(
    message: string,
    action: string,
    className = '',
    duration = NumberConstants.NOTIF_TIMEOUT,
  ) {
    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: [className],
    });
  }
}
