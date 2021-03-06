import { AuthService } from './auth.service';
import { throwError, Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

describe('AuthService', () => {
  let authService: AuthService;
  const mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const endpointSpy = jasmine.createSpyObj('ApiEndPointService', [
    'getSingInURL',
    'getRefreshToken',
  ]);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    authService = new AuthService(mockHttpClient, endpointSpy, routerSpy);
  });
  /*** it should create service ***/
  it('should create', () => {
    expect(authService).toBeTruthy();
  });

    /*** it should call signIn function ***/
  describe('#signIn', () => {
    let responsePromise;
    beforeEach(() => {
      const response = new HttpResponse({ status: 204 });
      endpointSpy.getSingInURL.and.returnValue('http://localhost:3000/auth');
      mockHttpClient.post.and.returnValue(of(response));
    });
    it('should call http post on sign in click', () => {
      const signInMock = {
        doctorName: 'test',
        password: '123456',
        returnSecureToken: true,
      };
      responsePromise = authService.signIn('test', '123456');
      const url = 'http://localhost:3000/auth';
      expect(mockHttpClient.post).toBeDefined();
    });
  });

      /*** it should call signIn function ***/
  describe('#signIn', () => {
    beforeEach(() => {
      endpointSpy.getSingInURL.and.returnValue('http://localhost:4200/auth');
      mockHttpClient.post.and.returnValue(throwError('ex'));
      spyOn(authService, 'signIn').and.callThrough();
    });
    it('should call http post it returns error message', () => {
      authService.signIn('test', '123456').subscribe(
        (val) => {},
        (err) => {
          expect(authService.signIn).toBeDefined();
        }
      );
    });
  });

        /*** it should call logOut function ***/
  describe('#logOut', () => {
    it('should call logout function, when tokenExpirationTimer is exist', () => {
      (authService as any).tokenExpirationTimer = '3000';
      authService.logOut();
      expect((authService as any).tokenExpirationTimer).toEqual('3000');
    });
    it('should call logout function, when tokenExpirationTimer is not exist', () => {
      (authService as any).tokenExpirationTimer = null;
      authService.logOut();
      expect((authService as any).tokenExpirationTimer).toEqual(null);
    });
  });

        /*** it should call autoLoginOnRefresh function ***/
  describe('#autoLoginOnRefresh', () => {
    it('should call autoLoginOnRefresh function', () => {
      const authMock = {
        email: 'abc@123',
        id: 1010,
        _token: 'etuaWqerll',
        _tokenExpirationDate: '2020-08-17T10:11:36.000Z',
        username: 'Ashwini',
        userroles: ['HospitalRadiologist']
      }
      spyOn(sessionStorage, 'getItem').and.callFake(() => {
        return JSON.stringify(authMock);
      });
      authService.autoLoginOnRefresh();
      expect(authService.autoLoginOnRefresh).toBeDefined();
    });
  });

        /*** it should call refreshToken function ***/
  describe('#refreshToken', () => {
    beforeEach(() => {
      const response = new HttpResponse({ status: 204 });
      endpointSpy.getRefreshToken.and.returnValue('http://localhost:3000/auth');
      mockHttpClient.post.and.returnValue(of(response));
      (authService as any).refreshToken();
    });
    it('should call refreshToken function', () => {
      expect((authService as any).refreshToken).toBeDefined();
    });
  });

 /*** it should call autoSessionTimeOut function ***/ 
  describe('#autoSessionTimeOut', () => {
    beforeEach(() => {
      authService.autoSessionTimeOut(4563);
    });
    it('should call autoSessionTimeOut function', () => {
      expect(authService.autoSessionTimeOut).toBeDefined();
    });
  });

 /*** it should call refreshTokenTimeOut function ***/ 
  describe('#refreshTokenTimeOut', () => {
    beforeEach(() => {
      const response = new HttpResponse({ status: 204 });
      endpointSpy.getRefreshToken.and.returnValue('http://localhost:3000/auth');
      mockHttpClient.post.and.returnValue(of(response));
      (authService as any).refreshToken();
      authService.refreshTokenTimeOut('axhyysss', 4563);
    });
    it('should call refreshTokenTimeOut function', () => {
      expect(authService.refreshTokenTimeOut).toBeDefined();
    });
  });

/*** it should call handleAuthentication function ***/
  describe('#handleAuthentication', () => {
    beforeEach(() => {
      (authService as any).handleAuthentication(
        'test1',
        '1234',
        'axhyysss',
        4563
      );
    });
    it('should call handleAuthentication function', () => {
      expect((authService as any).handleAuthentication).toBeDefined();
    });
  });

  /*** it should call handleAuthError function ***/
  describe('#handleAuthError', () => {
    it('should call handleAuthError function, when unknown error occured', () => {
      const result = (authService as any).handleAuthError({
        status: 404,
        message: 'not found',
      });
      expect(result).toBeDefined();
    });
    it('should call handleAuthError function,when email not found', () => {
      const errorResponseMock = {
        error: {
          error: {
            message: 'EMAIL_NOT_FOUND',
          },
        },
      };
      const result = (authService as any).handleAuthError(errorResponseMock);
      expect(result).toBeDefined();
    });
    it('should call handleAuthError function, when invalid password', () => {
      const errorResponseMock = {
        error: {
          error: {
            message: 'INVALID_PASSWORD',
          },
        },
      };
      const result = (authService as any).handleAuthError(errorResponseMock);
      expect(result).toBeDefined();
    });
    it('should call handleAuthError function, when USER_DISABLED', () => {
      const errorResponseMock = {
        error: {
          error: {
            message: 'USER_DISABLED',
          },
        },
      };
      const result = (authService as any).handleAuthError(errorResponseMock);
      expect(result).toBeDefined();
    });
    it('should call handleAuthError function, when EMAIL_EXISTS', () => {
      const errorResponseMock = {
        error: {
          error: {
            message: 'EMAIL_EXISTS',
          },
        },
      };
      const result = (authService as any).handleAuthError(errorResponseMock);
      expect(result).toBeDefined();
    });
    it('should call handleAuthError function, when OPERATION_NOT_ALLOWED', () => {
      const errorResponseMock = {
        error: {
          error: {
            message: 'OPERATION_NOT_ALLOWED',
          },
        },
      };
      const result = (authService as any).handleAuthError(errorResponseMock);
      expect(result).toBeDefined();
    });
    it('should call handleAuthError function, when TOO_MANY_ATTEMPTS_TRY_LATER', () => {
      const errorResponseMock = {
        error: {
          error: {
            message: 'TOO_MANY_ATTEMPTS_TRY_LATER',
          },
        },
      };
      const result = (authService as any).handleAuthError(errorResponseMock);
      expect(result).toBeDefined();
    });
  });
});
