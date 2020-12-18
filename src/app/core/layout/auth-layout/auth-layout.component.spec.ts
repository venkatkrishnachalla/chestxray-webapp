import { AuthLayoutComponent } from './auth-layout.component';

describe('AuthLayoutComponent', () => {
  let component: AuthLayoutComponent;
  const authServiceSpy = jasmine.createSpyObj('AuthService', [
    'user',
    'logOut',
  ]);
  const breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', [
    'observe',
  ]);
  const routerSpy = jasmine.createSpyObj('Router', ['']);

  beforeEach(() => {
    component = new AuthLayoutComponent(
      authServiceSpy,
      breakpointObserverSpy,
      routerSpy
    );
  });

  /*** expects auth component to be truthy ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** Spec for ngOnInit function ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      spyOn(component as any, 'initialize');
      component.ngOnInit();
    });
    it('should call ngOnIit function', () => {
      const result = component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
      expect((component as any).initialize).toHaveBeenCalled();
    });
  });

  /*** Spec for initialize function ***/
  describe('#initialize', () => {
    beforeEach(() => {
      authServiceSpy.user.and.returnValue({ username: 'test' });
      (component as any).initialize();
    });
    it('should call initialize function', () => {
      expect((component as any).initialize).toBeDefined();
    });
  });

  /*** Expects logout to have been called ***/
  describe('#onLogout', () => {
    it('should call onLogout function', () => {
      component.onLogout();
      expect(authServiceSpy.logOut).toHaveBeenCalled();
    });
  });
});
