import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavComponent } from './side-nav.component';

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SideNavComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /*** should create component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** should call onResize function on changing browser screen ***/
  describe('#onResize', () => {
    beforeEach(() => {
      spyOn(component, 'sidenavDisplay');
      component.onResize();
    });
    it('should call onResize function', () => {
      expect(component.sidenavDisplay).toHaveBeenCalled();
    });
  });

  /*** should call sidenavDisplay function, screen less than or equal to 760 ***/
  describe('#sidenavDisplay', () => {
    beforeEach(() => {
      spyOnProperty(window, 'innerWidth').and.returnValue(760);
      component.sidenavDisplay();
    });
    it('should call sidenavDisplay function on screen size less than 768', () => {
      expect(component.sidenavDisplay).toBeDefined();
      expect(component.sideNavToggle).toBe(true);
    });
  });

  /*** should call sidenavDisplay function, screen greater than 760 ***/
  describe('#sidenavDisplay', () => {
    beforeEach(() => {
      spyOnProperty(window, 'innerWidth').and.returnValue(780);
      component.sidenavDisplay();
    });
    it('should call sidenavDisplay function on screen size more than 768', () => {
      expect(component.sidenavDisplay).toBeDefined();
      expect(component.sideNavToggle).toBe(false);
    });
  });
});
