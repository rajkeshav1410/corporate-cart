import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Routes } from '../constants';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services';

export function httpRequestInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  const storageService = inject(StorageService);
  let newHeaders = new HttpHeaders();

  if (req.body instanceof FormData) {
    // newHeaders = newHeaders.append('Content-Type', 'multipart/form-data');
  } else if (req.body instanceof Blob) {
    newHeaders = newHeaders.append('Content-Type', 'application/octet-stream');
  } else {
    newHeaders = newHeaders.append('Content-Type', 'application/json');
  }
  req = req.clone({
    headers: newHeaders,
    withCredentials: true,
  });

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        storageService.clean();
        router.navigate([Routes.LOGIN]);
      }
      return throwError(() => error);
    }),
  );
}
