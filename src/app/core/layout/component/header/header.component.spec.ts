import { HeaderComponent } from './header.component';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  const authServiceSpy = jasmine.createSpyObj('AuthService', [
    'user',
    'logOut',
    'userSubject',
  ]);
  const routerSpy = jasmine.createSpyObj('Router', ['']);
  const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);

  beforeEach(() => {
    component = new HeaderComponent(authServiceSpy, routerSpy);
  });

  /*** should create component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** should call ngOnInit ***/
  describe('#ngOnInit', () => {
    const mockInResponse = {
      username: 'mohan',
      userroles: ['hospitalradiologist'],
    };
    beforeEach(() => {
      spyOn(component as any, 'initialize');
    });
    it('should call ngOnIit function', () => {
      authServiceSpy.userSubject = of(mockInResponse);
      const result = component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
      expect((component as any).initialize).toHaveBeenCalled();
    });
    it('should call ngOnIit function, when user is undefined', () => {
      authServiceSpy.userSubject = of(null);
      const result = component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
      expect((component as any).initialize).toHaveBeenCalled();
    });
  });

  /*** should call initialize ***/
  describe('#initialize', () => {
    beforeEach(() => {
      component.isAuth = true;
      (component as any).initialize();
    });
    it('should call initialize function', () => {
      expect(component.isAuth).toEqual(true);
    });
  });

  /*** should call onLogout ***/
  describe('#onLogout', () => {
    beforeEach(() => {
      component.onLogout();
    });
    it('should call onLogout function', () => {
      expect(authServiceSpy.logOut).toHaveBeenCalled();
    });
  });

  /*** should call toggleSidenav ***/
  describe('#toggleSidenav', () => {
    beforeEach(() => {
      component.toggleSidenav();
    });
    it('should call toggleSidenav function', () => {
      expect(component.toggleSidenav).toBeDefined();
    });
  });

  /*** should call ngOnDestroy ***/
  describe('#ngOnDestroy', () => {
    it('it should call ngOnDestroy', () => {
      (component as any).userSubscription = subscriptionSpy;
      component.ngOnDestroy();
      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
    });
  });
});
