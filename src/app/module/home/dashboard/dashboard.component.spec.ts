import { DashboardComponent } from './dashboard.component';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  const authServiceSpy = jasmine.createSpyObj('AuthService', [
    'user',
    'logOut',
    'userSubject',
  ]);
  const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);

  beforeEach(() => {
    component = new DashboardComponent(authServiceSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    const mockInResponse = {
      username: 'mohan',
      userroles: ['HospitalRadiologist'],
    };
    it('should call ngOnIit function', () => {
      authServiceSpy.userSubject = of(mockInResponse);
      component.ngOnInit();
      expect(component.isHospitalRadiologist).toEqual(true);
    });
    it('should call ngOnIit function, when user is individual radiologist', () => {
      const mockInResponseInd = {
        username: 'mohan',
        userroles: ['Individual'],
      };
      authServiceSpy.userSubject = of(mockInResponseInd);
      component.ngOnInit();
      expect(component.isHospitalRadiologist).toEqual(false);
    });
    it('should call ngOnIit function, when user is undefined', () => {
      authServiceSpy.userSubject = of(null);
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  describe('#ngOnDestroy', () => {
    it('it should call ngOnDestroy', () => {
      (component as any).userSubscription = subscriptionSpy;
      component.ngOnDestroy();
      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
    });
  });
});
