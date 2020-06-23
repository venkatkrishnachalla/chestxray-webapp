import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenav } from '@angular/material/sidenav';
import { MainLayoutComponent } from './main-layout.component';

fdescribe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  const MatSidenavSpy = jasmine.createSpyObj('MatSidenav', ['close', 'toggle']);

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

  describe('#close', () => {
    beforeEach(() => {
      component.sidenav = MatSidenavSpy;
      component.close();
    });
    it('should call close function', () => {
      expect(component.sidenav.close).toHaveBeenCalled();
    });
  });

  describe('#toggle', () => {
    beforeEach(() => {
      component.sidenav = MatSidenavSpy;
      component.toggleSidenavBar('hello');
    });
    it('should call close function', () => {
      expect(component.sidenav.toggle).toHaveBeenCalled();
    });
  });
});
