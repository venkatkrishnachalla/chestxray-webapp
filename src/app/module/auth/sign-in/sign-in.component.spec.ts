import { SignInComponent } from './sign-in.component';
import { NgForm } from '@angular/forms';
import { of, throwError } from 'rxjs';

fdescribe('SignInComponent', () => {
  let component: SignInComponent;
  const alertSpy = jasmine.createSpyObj('SnackbarService', ['open']);
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['signIn']);
  const consoleServiceSpy = jasmine.createSpyObj('ConsoleService', ['log']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    component = new SignInComponent(
      alertSpy,
      authServiceSpy,
      consoleServiceSpy,
      routerSpy
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
      } as NgForm;
      component.onSignIn(testForm);
    });
    it('should call onSignIn function, when login is successful', () => {
      authServiceSpy
        .signIn('test', 'test@123')
        .subscribe((authResponse: any) => {
          expect(component.isLoading).toEqual(false);
          expect(consoleServiceSpy.log).toHaveBeenCalledWith(authResponse);
          expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
        });
    });
  });

  describe('#onSignIn', () => {
    beforeEach(() => {
      const signInErrorResponse = { status: 401 };
      const testForm = {
        value: {
          email: 'test',
          password: 'test@123',
        },
        valid: true,
        resetForm: () => null,
      } as NgForm;
      authServiceSpy.signIn.and.returnValue(throwError(signInErrorResponse));
      component.onSignIn(testForm);
    });
    it('should call onSignIn function, when login error', () => {
      expect(component.isLoading).toEqual(false);
      expect(alertSpy.open).toHaveBeenCalledWith(
        'Invalid Username or Password',
        'ERROR'
      );
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
