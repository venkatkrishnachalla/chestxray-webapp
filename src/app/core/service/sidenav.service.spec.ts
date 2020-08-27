import { SidenavService } from './sidenav.service';

describe('SidenavService', () => {
  let service: SidenavService;
  const matSidenavSpy = jasmine.createSpyObj('MatSidenav', [
    'close',
    'toggle',
    'open',
  ]);

  beforeEach(() => {
    service = new SidenavService();
  });
/*** it should create service ***/
  it('should create', () => {
    expect(service).toBeTruthy();
  });

    /*** it should setSidenav function ***/
  describe('#setSidenav', () => {
    beforeEach(() => {
      service.setSidenav(matSidenavSpy);
    });
    it('should call toggle function', () => {
      expect(service.setSidenav).toBeDefined();
      expect(service.sidenav).toBe(matSidenavSpy);
    });
  });

      /*** it should open function ***/
  describe('#open', () => {
    beforeEach(() => {
      service.sidenav = matSidenavSpy;
      service.open();
    });
    it('should call open function', () => {
      expect(service.open).toBeDefined();
      expect(service.sidenav.open).toHaveBeenCalled();
    });
  });

   /*** it should close function ***/
  describe('#close', () => {
    beforeEach(() => {
      service.sidenav = matSidenavSpy;
      service.close();
    });
    it('should call close function', () => {
      expect(service.close).toBeDefined();
      expect(service.sidenav.close).toHaveBeenCalled();
    });
  });

  /*** it should toggle function ***/
  describe('#toggle', () => {
    beforeEach(() => {
      service.sidenav = matSidenavSpy;
      service.toggle();
    });
    it('should call toggle function', () => {
      expect(service.toggle).toBeDefined();
      expect(service.sidenav.toggle).toHaveBeenCalled();
    });
  });
});
