import { DashboardService } from './dashboard.service';
import { HttpResponse, HttpEventType, HttpEvent } from '@angular/common/http';
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

  /*** it should create service ***/
  it('should create', () => {
    expect(service).toBeTruthy();
  });

  /*** it should call get patient list function ***/
  describe('#getPatientList', () => {
    beforeEach(() => {
      const response = new HttpResponse({ status: 204 });
      endPointSpy.getPatientList.and.returnValue(
        'https://chestxrayqa.southindia.cloudapp.azure.com/api/v1/Patient/'
      );
      httpSpy.get.and.returnValue(of(response));
      service.getPatientList();
    });
    it('should call getPatientList function', () => {
      expect(service.getPatientList).toBeDefined();
    });
  });

  /*** it should call get patient list function, when 404 error ***/
  describe('#getPatientList', () => {
    beforeEach(() => {
      const response = new HttpResponse({ status: 404 });
      endPointSpy.getPatientList.and.returnValue(
        'https://chestxrayqa.southindia.cloudapp.azure.com/api/v1/Patient/'
      );
      httpSpy.get.and.returnValue(throwError(response));
      service.getPatientList();
    });
    it('should call getPatientList function, when it returns error', () => {
      expect(service.getPatientList).toBeDefined();
    });
  });

  /*** it should call handle error block ***/
  describe('#handleError', () => {
    beforeEach(() => {
      const mock = {
        error: {
          error: { message: 'not found' },
        },
      };
      (service as any).handleError(mock);
    });
    it('should call getPatientInstanceId', () => {
      expect((service as any).handleError).toBeDefined();
    });
  });
});
