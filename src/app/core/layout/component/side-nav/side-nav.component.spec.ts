import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavComponent } from './side-nav.component';

fdescribe('SideNavComponent', () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onResize', () => {
    beforeEach(() => {
      spyOn(component, 'sidenavDisplay');
      component.onResize();
    });
    it('should call onResize function', () => {
      expect(component.sidenavDisplay).toHaveBeenCalled();
    });
  });

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
