import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

fdescribe('HomeComponent', () => {
  let component: HomeComponent;
  const authServiceSpy = jasmine.createSpyObj('AuthService', [
    'user',
    'logOut',
  ]);

  beforeEach(() => {
    component = new HomeComponent(
      authServiceSpy
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

  describe('#logOut', () => {
    beforeEach(() => {
      component.logOut();
    });
    it('should call logOut function', () => {
      expect(authServiceSpy.logOut).toHaveBeenCalled();
    });
  });
});
