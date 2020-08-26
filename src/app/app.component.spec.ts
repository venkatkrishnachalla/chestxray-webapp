import { AppComponent } from './app.component';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  const authServiceSpy = jasmine.createSpyObj('AuthService', [
    'autoLoginOnRefresh',
  ]);
  const spinnerServiceSpy = jasmine.createSpyObj('SpinnerService', [
    'getLoaderData',
  ]);

  beforeEach(() => {
    component = new AppComponent(authServiceSpy, spinnerServiceSpy);
  });

  /*** it should create component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should ngOnInit function ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'loginOnBrowserRefresh');
      spinnerServiceSpy.getLoaderData.and.callFake(() => {
        return of(false);
      });
    });
    it('should call ngOnIit function', () => {
      component.isLoading = false;
      component.ngOnInit();
      expect(component.loginOnBrowserRefresh).toHaveBeenCalled();
    });
  });

    /*** it should loginOnBrowserRefresh function ***/
  describe('#loginOnBrowserRefresh', () => {
    beforeEach(() => {
      component.loginOnBrowserRefresh();
    });
    it('should call loginOnBrowserRefresh function', () => {
      expect(authServiceSpy.autoLoginOnRefresh).toHaveBeenCalled();
    });
  });
});
