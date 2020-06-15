import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

fdescribe('AppComponent', () => {
  let component: AppComponent;
  const authServiceSpy = jasmine.createSpyObj('AuthService', [
    'autoLoginOnRefresh'
  ]);

  beforeEach(() => {
    component = new AppComponent(
      authServiceSpy
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'loginOnBrowserRefresh');
      component.ngOnInit();
    });
    it('should call ngOnIit function', () => {
      const result = component.ngOnInit();
      expect(component.loginOnBrowserRefresh).toHaveBeenCalled();
    });
  });

  describe('#loginOnBrowserRefresh', () => {
    beforeEach(() => {
      component.loginOnBrowserRefresh();
    });
    it('should call loginOnBrowserRefresh function', () => {
      expect(authServiceSpy.autoLoginOnRefresh).toHaveBeenCalled();
    });
  });

  // it(`should have as title 'cxr-web-app'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   expect(app.title).toEqual('cxr-web-app');
  // });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement;
  //   expect(compiled.querySelector('.content span').textContent).toContain('cxr-web-app app is running!');
  // });
});
