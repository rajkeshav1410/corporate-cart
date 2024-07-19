import { HttpErrorResponse } from '@angular/common/http';

export interface CustomHttpErrorResponse extends HttpErrorResponse {
  error: { message: ''; success: false };
}
