import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/module/auth/auth.service';
import { take, exhaustMap } from 'rxjs/operators';
import { SnackbarService } from '../service/snackbar.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private alert: SnackbarService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.authService.userSubject.pipe(
      take(1),
      exhaustMap((user) => {
        // Or in general check url of the service request
        if (!user) {
          return next.handle(request);
        }
        // Below example - adding token to url as query parameter.
        const reqWithToken = this.addTokenToHeader(request, user.token);
        // Enable either above or below.
        // Below example - adding token to Headers
        // const reqWithToken = this.addTokenToHeader(request, user.token);
        return next.handle(reqWithToken);
      })
    );
  }

  private addTokenToUrl(request: HttpRequest<any>, token: string) {
    return request.clone({
      params: new HttpParams().set('auth', token),
    });
  }

  private addTokenToHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
