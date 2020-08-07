import { MainLayoutComponent } from './main-layout.component';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  const matSidenavSpy = jasmine.createSpyObj('MatSidenav', ['close', 'toggle']);

  beforeEach(() => {
    component = new MainLayoutComponent();
  });

  /*** should create component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** should call ngOnInit function ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should call ngOnInit function', () => {
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** should call close function ***/
  describe('#close', () => {
    beforeEach(() => {
    component.sidenav =  matSidenavSpy;
    component.close();
    });
    it('should call close function', () => {
      expect(component.close).toBeDefined();
      expect(component.sidenav.close).toHaveBeenCalled();
    });
  });

  /*** should call toggleSidenavBar function ***/
  describe('#toggleSidenavBar', () => {
    beforeEach(() => {
      component.sidenav =  matSidenavSpy;
      component.toggleSidenavBar('hello');
    });
    it('should call toggleSidenavBar function', () => {
      expect(component.toggleSidenavBar).toBeDefined();
      expect( component.sidenav.toggle).toHaveBeenCalled();
    });
  });
});
