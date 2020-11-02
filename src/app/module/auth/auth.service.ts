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
import { NgxIndexedDBService } from 'ngx-indexed-db';
export const FIREBASE_API_KEY = 'AIzaSyBmHTkeOUxDWQ9VDLx2TP3mzyhbamcGHiI';
const FIREBASE_SIGN_IN_ENDPOINT =
  'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
  FIREBASE_API_KEY;
interface AuthResponseData {
  idToken: string;
  email: string;
  token: string;
  refreshToken: string;
  expiration: string;
  localId: string;
  registered?: boolean;
  username: string;
  userroles: any[];
}
@Injectable({
  providedIn: 'root',
})
// AuthService class implementation
export class AuthService {
  public userSubject: BehaviorSubject<User>;
  private tokenExpirationTimer: any;
  private refreshTokenTimer: any;
  public addRadiologist = new BehaviorSubject(false);

  /*
   * constructor for AuthService class
   */

  constructor(
    private http: HttpClient,
    private endpoint: ApiEndPointService,
    private router: Router,
    private dbService: NgxIndexedDBService
  ) {
    this.userSubject = new BehaviorSubject<User>(null);
  }

  public get user(): User {
    return this.userSubject.value;
  }

  /**
   * This is a signIn click function.
   * @param '{string}' value - A string param
   * @param '{string}' value - A string param
   * @example
   * signIn(email, password);
   */

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
            responseDate.refreshToken,
            responseDate.expiration,
            responseDate.username,
            responseDate.userroles
          );
        })
      );
  }

  /**
   * This is a logOut function.
   * @param '{void}' empty - A empty param
   * @example
   * logOut();
   */

  logOut() {
    this.userSubject.next(null);
    this.router.navigate(['/auth/login']);
    sessionStorage.removeItem('userAuthData');
    sessionStorage.removeItem('patientDetail');
    this.dbService.clear('PatientImage').subscribe((successDeleted) => {});
    sessionStorage.removeItem('isIndividualRadiologist');
    sessionStorage.removeItem('askAiSelection');
    sessionStorage.removeItem('reportPageSelection');
    sessionStorage.removeItem('x-ray_Data');
    sessionStorage.removeItem('impression');
    sessionStorage.removeItem('findings');
    sessionStorage.removeItem('patientRows');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('findingsData');
    sessionStorage.clear();
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    // if refresh token is enabled
    if (this.tokenExpirationTimer) {
      clearTimeout(this.refreshTokenTimer);
    }
  }

  /**
   * This is a autoLoginOnRefresh function.
   * @param '{void}' empty - A empty param
   * @example
   * autoLoginOnRefresh();
   */

  autoLoginOnRefresh() {
    const authDataSession = JSON.parse(sessionStorage.getItem('userAuthData'));
    if (authDataSession) {
      const tokenNew = window.atob(authDataSession._token);
      authDataSession._token = tokenNew;
    }
    const authData: {
      email: string;
      id: string;
      _token: string;
      refreshToken: string;
      _tokenExpirationDate: string;
      username: string;
      userroles: any[];
    } = authDataSession;
    if (!authData) {
      return;
    }
    const curUser = new User(
      authData.email,
      authData.id,
      authData._token,
      authData.refreshToken,
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

  /**
   * This is a refreshToken function.
   * @param '{string}' value - A string param
   * @example
   * refreshToken(token);
   */

  public refreshToken(
    accessToken: string,
    refreshToken: string,
    username: string,
    userroles: any,
    _tokenExpirationDate: Date
  ) {
    const token = {
      // tslint:disable-next-line: object-literal-shorthand
      accessToken: accessToken,
      // tslint:disable-next-line: object-literal-shorthand
      refreshToken: refreshToken,
    };
    return this.http.post(this.endpoint.getRefreshToken(), token).subscribe(
      (data: any) => {
        const UserInfo = {
          // tslint:disable-next-line: object-literal-shorthand
          username: username,
          // tslint:disable-next-line: object-literal-shorthand
          userroles: userroles,
          // tslint:disable-next-line: object-literal-shorthand
          _tokenExpirationDate: _tokenExpirationDate,
          _token: data.accessToken,
          refreshToken: data.refreshToken,
        };
        const user = new User(
          null,
          null,
          data.accessToken,
          data.refreshToken,
          _tokenExpirationDate,
          username,
          userroles
        );
        sessionStorage.removeItem('userAuthData');
        sessionStorage.setItem('userAuthData', JSON.stringify(UserInfo));
        sessionStorage.setItem('accessToken', data.accessToken);
        this.userSubject.next(user);
      },
      (error) => {}
    );
  }

  /**
   * This is a autoSessionTimeOut function.
   * @param '{number}' index - A number param
   * @example
   * autoSessionTimeOut(expirationDuration);
   */

  autoSessionTimeOut(expirationDuration: number) {
    const expireTime = expirationDuration - 60000;
    this.tokenExpirationTimer = setTimeout(() => {
      const accessToken = JSON.parse(sessionStorage.getItem('userAuthData'));
      const token = sessionStorage.getItem('accessToken');
      this.refreshToken(
        token,
        accessToken.refreshToken,
        accessToken.username,
        accessToken.userroles,
        accessToken._tokenExpirationDate
      );
    }, expireTime);
  }

  /**
   * This is a Refresh token a minute before it expires.
   * @param '{string}' value - A string param
   * @param '{number}' index - A number param
   * @example
   * refreshTokenTimeOut(token, expirationDuration);
   */

  refreshTokenTimeOut(
    token: string,
    refreshToken: string,
    expirationDuration: number
  ) {
    this.refreshTokenTimer = setTimeout(() => {
      // this.refreshToken(token, refreshToken);
    }, expirationDuration - 60 * 1000);
  }

  /**
   * This is a handleAuthentication function.
   * @param '{string}' value - A string param
   * @param '{string}' value - A string param
   * @param '{string}' value - A string param
   * @param '{any}' data - A array param
   * @param '{string}' value - A string param
   * @param '{any}' data - A array param
   * @example
   * handleAuthentication(email, userID, token, expiresIn, username, userroles);
   */

  private handleAuthentication(
    email: string,
    userID: string,
    token: string,
    refreshToken: string,
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
      refreshToken,
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
  }

  /**
   * This is a handleAuthError function.
   * @param '{errorResponse}' HttpErrorResponse - A response param
   * @example
   * handleAuthError(errorResponse);
   */

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
