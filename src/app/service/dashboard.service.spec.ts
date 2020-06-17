import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';

fdescribe('DashboardService', () => {
  let service: DashboardService;
  const httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
  const endPointSpy = jasmine.createSpyObj('ApiEndPointService', [
    'getPatientList',
  ]);

  beforeEach(() => {
    service = new DashboardService(httpSpy, endPointSpy);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('#getPatientList', () => {
    beforeEach(() => {
      service.getPatientList();
    });
    it('should call getPatientList function', () => {});
  });
});
