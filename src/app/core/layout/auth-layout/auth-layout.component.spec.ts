import { AuthLayoutComponent } from './auth-layout.component';

fdescribe('AuthLayoutComponent', () => {
  let component: AuthLayoutComponent;
  const authServiceSpy = jasmine.createSpyObj('AuthService', [
    'user',
    'logOut',
  ]);

  beforeEach(() => {
    component = new AuthLayoutComponent(authServiceSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

  describe('#initialize', () => {
    beforeEach(() => {
      authServiceSpy.user.and.returnValue({ username: 'test' });
      (component as any).initialize();
    });
    it('should call initialize function', () => {
      expect((component as any).initialize).toBeDefined();
    });
  });

  describe('#onLogout', () => {
    it('should call onLogout function', () => {
      component.onLogout();
      expect(authServiceSpy.logOut).toHaveBeenCalled();
    });
  });
});
