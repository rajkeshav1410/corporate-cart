import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NOTIF_TIMEOUT } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private readonly snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {}

  success(message: string) {
    this.openSnackBar(message, '', 'success-snackbar');
  }

  error(message: string) {
    this.openSnackBar(message, '', 'error-snackbar');
  }

  openSnackBar(
    message: string,
    action: string,
    className = '',
    duration = NOTIF_TIMEOUT,
  ) {
    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: [className],
    });
  }
}
