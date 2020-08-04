import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import User from './user.modal';
import { Router } from '@angular/router';
import { ApiEndPointService } from 'src/app/core/service/api-end-point.service';
import { ToastrService } from 'ngx-toastr';
export const FIREBASE_API_KEY = 'AIzaSyBmHTkeOUxDWQ9VDLx2TP3mzyhbamcGHiI';
const FIREBASE_SIGN_IN_ENDPOINT =
  'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
  FIREBASE_API_KEY;
interface AuthResponseData {
  idToken: string;
  email: string;
  token: string;
  expiration: string;
  localId: string;
  registered?: boolean;
  username: string;
  userroles: any[];
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
    private router: Router,
    private toastrService: ToastrService
  ) {
    this.userSubject = new BehaviorSubject<User>(null);
  }

  public get user(): User {
    return this.userSubject.value;
  }

  signIn(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.endpoint.getSingInURL(), {
        UserName: email,
        Password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleAuthError),
        tap((responseDate) => {
          this.handleAuthentication(
            responseDate.email,
            responseDate.localId,
            responseDate.token,
            responseDate.expiration,
            responseDate.username,
            responseDate.userroles
          );
        })
      );
  }

  logOut() {
    this.userSubject.next(null);
    this.router.navigate(['/auth/login']);
    localStorage.removeItem('userAuthData');
    sessionStorage.removeItem('patientDetail');
    sessionStorage.removeItem('PatientImage');
    sessionStorage.removeItem('isIndividualRadiologist');
    sessionStorage.removeItem('askAiSelection');
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
      username: string;
      userroles: any[];
    } = JSON.parse(localStorage.getItem('userAuthData'));
    if (!authData) {
      return;
    }
    const curUser = new User(
      authData.email,
      authData.id,
      authData._token,
      new Date(authData._tokenExpirationDate),
      authData.username,
      authData.userroles
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
            +responseDate.expiresIn,
            this.user.username,
            this.user.userroles
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
    expiresIn: any,
    username: string,
    userroles: any
  ) {
    //  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const expirationDate = new Date(expiresIn);
    const user = new User(
      email,
      userID,
      token,
      expirationDate,
      username,
      userroles
    );

    this.userSubject.next(user);
    const startDate = new Date().getTime();
    const endDate = new Date(expiresIn).getTime();
    const seconds = endDate - startDate;
    this.autoSessionTimeOut(seconds);
    // Or refresh token, if you decide to keep the session active.
    // this.refreshTokenTimeOut(user.token, expiresIn * 1000);
    localStorage.setItem('userAuthData', JSON.stringify(user));
  }

  private handleAuthError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';
    if (errorResponse.status === 0) {
      return throwError('Server not reachable');
    } else if (!errorResponse.error || !errorResponse.error.error) {
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
