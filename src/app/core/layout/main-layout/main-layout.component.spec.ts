import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLayoutComponent } from './main-layout.component';

fdescribe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainLayoutComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainLayoutComponent);
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
    it('should call ngOnIit function', () => {
      expect(component.sidenavDisplay).toHaveBeenCalled();
    });
  });

  describe('#close', () => {
    beforeEach(() => {
      component.close();
    });
    it('should call close function', () => {
     
    });
  });

  describe('#sidenavDisplay', () => {
    beforeEach(() => {
      component.sidenavDisplay();
    });
    it('should call sidenavDisplay function', () => {
      expect(component.sidenavDisplay).toBeDefined();
    });
  });
});
