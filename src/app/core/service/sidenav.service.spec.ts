import { SidenavService } from './sidenav.service';

describe('SidenavService', () => {
  let service: SidenavService;
  const matSidenavSpy = jasmine.createSpyObj('MatSidenav', ['close', 'toggle', 'open']);

  beforeEach(() => {
    service = new SidenavService();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  
  describe('#setSidenav', () => {
    beforeEach(() =>{
      service.setSidenav(matSidenavSpy);
    })
    it('should call toggle function', () => {
      expect(service.setSidenav).toBeDefined();
      expect(service.sidenav).toBe(matSidenavSpy);
    });
  });

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

  describe('#toggle', () => {
    beforeEach(() =>{
      service.sidenav = matSidenavSpy;
      service.toggle();
    })
    it('should call toggle function', () => {
      expect(service.toggle).toBeDefined();
      expect(service.sidenav.toggle).toHaveBeenCalled();
    });
  });
});
