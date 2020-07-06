import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

fdescribe('HeaderComponent', () => {
  let component: HeaderComponent;
  const authServiceSpy = jasmine.createSpyObj('AuthService', [
    'user',
    'logOut',
  ]);
  const routerSpy = jasmine.createSpyObj('Router', ['']);

  beforeEach(() => {
    component = new HeaderComponent(
      authServiceSpy,
      routerSpy,
    );
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
      (component as any).initialize();
    });
    it('should call initialize function', () => {
      const result = (component as any).ngOnInit();
      expect((component as any).ngOnInit).toBeDefined();
    });
  });

  describe('#onLogout', () => {
    beforeEach(() => {
      component.onLogout();
    });
    it('should call onLogout function', () => {
      expect(authServiceSpy.logOut).toHaveBeenCalled();
    });
  });

  describe('#toggleSidenav', () => {
    beforeEach(() => {
      component.toggleSidenav();
    });
    it('should call toggleSidenav function', () => {
      expect(component.toggleSidenav).toBeDefined();
    });
  });
});
