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

  success(message: string, duration?: number) {
    this.openSnackBar(
      message,
      '',
      'success-snackbar',
      duration ?? NumberConstants.NOTIF_TIMEOUT,
    );
  }

  error(message: string, duration?: number) {
    this.openSnackBar(
      message,
      '',
      'error-snackbar',
      duration ?? NumberConstants.NOTIF_TIMEOUT,
    );
  }

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
