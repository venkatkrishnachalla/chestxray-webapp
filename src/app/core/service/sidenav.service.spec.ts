import { SidenavService } from './sidenav.service';
import { MatSidenav } from '@angular/material/sidenav';

describe('SidenavService', () => {
  let service: SidenavService;

  beforeEach(() => {
    service = new SidenavService();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  // describe('#setSidenav', () => {
  //   beforeEach(() => {
  //     const MatSidenav = {
  //       fixedInViewport: '',
  //       _fixedInViewport: '',
  //       fixedTopGap: '',
  //       _fixedTopGap: '',
  //     };
  //     service.setSidenav(MatSidenav);
  //   });
  //   it('should call setSidenav function', () => {
  //     expect(service.setSidenav).toBeDefined();
  //   });
  // });

  describe('#open', () => {
    beforeEach(() => {
      service.open();
    });
    it('should call open function', () => {
      expect(service.open).toBeDefined();
    });
  });

  describe('#close', () => {
    it('should call close function', () => {
      service.close();
      expect(service.close).toBeDefined();
    });
  });

  describe('#toggle', () => {
    it('should call toggle function', () => {
      service.toggle();
      expect(service.toggle).toBeDefined();
    });
  });
});
