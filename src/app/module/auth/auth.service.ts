import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import User from './user.modal';
import { Router } from '@angular/router';
import { ApiEndPointService } from 'src/app/core/service/api-end-point.service';
export const FIREBASE_API_KEY = 'AIzaSyBmHTkeOUxDWQ9VDLx2TP3mzyhbamcGHiI';
const FIREBASE_SIGN_IN_ENDPOINT =
  'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
  FIREBASE_API_KEY;
interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userSubject: BehaviorSubject<User>;
  private tokenExpirationTimer: any;
  private refreshTokenTimer: any;

  constructor(
    private http: HttpClient,
    private endpoint: ApiEndPointService,
    private router: Router
  ) {
    this.userSubject = new BehaviorSubject<User>(null);
  }

  public get user(): User {
    return this.userSubject.value;
  }

  signIn(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.endpoint.getSingInURL(), {
        doctorName: email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleAuthError),
        tap((responseDate) => {
          responseDate = {
            idToken: '22373588',
            email: 'Nayeli_Adams0@gmail.com',
            refreshToken: '79660343',
            expiresIn: '30000',
            localId: 'non incididunt ut laborum fugiat',
            registered: true,
          };
          this.handleAuthentication(
            responseDate.email,
            responseDate.localId,
            responseDate.idToken,
            +responseDate.expiresIn
          );
        })
      );
  }

  logOut() {
    this.userSubject.next(null);
    this.router.navigate(['/auth/login']);
    localStorage.removeItem('userAuthData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    // if refresh token is enabled
    if (this.tokenExpirationTimer) {
      clearTimeout(this.refreshTokenTimer);
    }
  }

  autoLoginOnRefresh() {
    const authData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userAuthData'));
    if (!authData) {
      return;
    }
    const curUser = new User(
      authData.email,
      authData.id,
      authData._token,
      new Date(authData._tokenExpirationDate)
    );

    if (curUser.token) {
      this.userSubject.next(curUser);
      this.autoSessionTimeOut(
        new Date(authData._tokenExpirationDate).getTime() - new Date().getTime()
      );
      // Or refresh token, if you decide to keep the session active.
      // this.refreshTokenTimeOut(curUser.token, new Date(authData._tokenExpirationDate).getTime() - new Date().getTime());
    }
  }

  private refreshToken(token: string) {
    return this.http
      .post<{ idToken: string; refreshToken: string; expiresIn }>(
        this.endpoint.getRefreshToken(),
        {
          token,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleAuthError),
        tap((responseDate) => {
          this.handleAuthentication(
            this.user.email,
            this.user.id,
            responseDate.idToken,
            +responseDate.expiresIn
          );
        })
      );
  }

  //
  autoSessionTimeOut(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logOut();
    }, expirationDuration);
  }

  /**
   * Refresh token a minute before it expires
   * @param expirationDuration - expiration time in ms.
   */
  refreshTokenTimeOut(token, expirationDuration: number) {
    this.refreshTokenTimer = setTimeout(() => {
      this.refreshToken(token);
    }, expirationDuration - 60 * 1000);
  }

  private handleAuthentication(
    email: string,
    userID: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userID, token, expirationDate);

    this.userSubject.next(user);
    this.autoSessionTimeOut(expiresIn * 1000);
    // Or refresh token, if you decide to keep the session active.
    // this.refreshTokenTimeOut(user.token, expiresIn * 1000);
    localStorage.setItem('userAuthData', JSON.stringify(user));
  }

  private handleAuthError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }

    switch (errorResponse.error.error.message) {
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid Password';
        break;
      case 'USER_DISABLED':
        errorMessage = 'User Disabled';
        break;
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'Password sign-in is disabled';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage =
          'We have blocked all requests from this device due to unusual activity. Try again later';
        break;

      default:
        break;
    }
    return throwError(errorMessage);
  }
}
