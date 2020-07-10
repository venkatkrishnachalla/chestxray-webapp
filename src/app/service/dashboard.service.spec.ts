import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('DashboardService', () => {
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
      spyOn(service, 'getPatientList');
      service.getPatientList();
    });
    it('should call getPatientList function', () => {
      expect(service.getPatientList).toHaveBeenCalled();
    });
  });
});
