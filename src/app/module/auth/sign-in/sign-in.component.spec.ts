import { SignInComponent } from './sign-in.component';
import { NgForm } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('SignInComponent', () => {
  let component: SignInComponent;
  const alertSpy = jasmine.createSpyObj('SnackbarService', ['open']);
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['signIn']);
  const consoleServiceSpy = jasmine.createSpyObj('ConsoleService', ['log']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const spinnerServiceSpy = jasmine.createSpyObj('SpinnerService', ['show', 'hide']);

  beforeEach(() => {
    component = new SignInComponent(
      alertSpy,
      authServiceSpy,
      consoleServiceSpy,
      routerSpy,
      spinnerServiceSpy
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  describe('#ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should call ngOnIit function', () => {
      const result = component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  describe('#onSignIn', () => {
    beforeEach(() => {
      const signInResponse = {
        IsLoginSuccessful: true,
        doctorId: '1',
        loginMessage: 'login is successful',
      };
      authServiceSpy.signIn.and.returnValue(of(signInResponse));
      const testForm = {
        value: {
          email: 'test',
          password: 'test@123',
        },
        valid: true,
        resetForm: () => null,
        reset: () => null,
      } as NgForm;
      component.onSignIn(testForm);
    });
    it('should call onSignIn function, when login is successful', () => {
      expect(spinnerServiceSpy.show).toHaveBeenCalled();
      authServiceSpy
        .signIn('test', 'test@123')
        .subscribe((authResponse: any) => {
          expect(routerSpy.navigate).toHaveBeenCalledWith(['/home/dashboard']);
        });
    });
  });

  describe('#onSignIn', () => {
    const testForm = {
      value: {
        email: 'test',
        password: 'test@123',
      },
      valid: true,
      resetForm: () => null,
      reset: () => null,
    } as NgForm;
    beforeEach(() => {
      const signInErrorResponse = { status: 401 };
      authServiceSpy.signIn.and.returnValue(throwError(signInErrorResponse));
    });
    it('should call onSignIn function, when login error', () => {
      spyOnProperty(Navigator.prototype, 'onLine').and.returnValue(true);
      component.onSignIn(testForm);
      expect(spinnerServiceSpy.hide).toHaveBeenCalled();
      expect(alertSpy.open).toHaveBeenCalledWith(
        'Invalid Username or Password',
        'ERROR'
      );
    });
    it('should call onSignIn function, when login error, when network is false', () => {
      spyOnProperty(Navigator.prototype, 'onLine').and.returnValue(false);
      component.onSignIn(testForm);
      const message =
        'You are not connected to a network. Check your network connections and try again.';
      expect(alertSpy.open).toHaveBeenCalledWith(message, 'ERROR');
    });
  });

  describe('#onSignIn', () => {
    beforeEach(() => {
      const testForm = {
        value: {
          email: 'test',
          password: 'test@123',
        },
        valid: false,
        resetForm: () => null,
        reset: () => null,
      } as NgForm;
      component.onSignIn(testForm);
    });
    it('should call onSignIn function, when form is invalid', () => {
      component.errorMessage = 'Enter all the required fields';
      expect(alertSpy.open).toHaveBeenCalledWith(
        component.errorMessage,
        'ERROR'
      );
    });
  });
});
