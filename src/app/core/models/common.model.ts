import { HttpErrorResponse } from '@angular/common/http';

export interface CustomHttpErrorResponse extends HttpErrorResponse {
  error: { message: ''; success: false };
}

export interface Param {
  [key: string]: string | number;
}

export interface MenuItem {
  value: string;
  viewValue: string;
}
