import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayoutComponent } from './main-layout.component';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  const MatSidenavspy = jasmine.createSpyObj('MatSidenav', ['close', 'toggle']);

  beforeEach(() => {
    component = new MainLayoutComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#close', () => {
    beforeEach(() => {
      component.close();
    });
    it('should call close function', () => {
      expect(MatSidenavspy.close).toHaveBeenCalled();
    });
  });
});
