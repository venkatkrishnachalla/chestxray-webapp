import { DashboardService } from './dashboard.service';
import { HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

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
      const response = new HttpResponse({ status: 204 });
      endPointSpy.getPatientList.and.returnValue(
        'https://chestxrayqa.southindia.cloudapp.azure.com/api/v1/Patient/'
      );
      httpSpy.get.and.returnValue(of(response));
      service.getPatientList();
    });
    it('should call getPatientList function', () => {});
  });
});
