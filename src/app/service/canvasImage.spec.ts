import { TestBed } from '@angular/core/testing';

import { xrayImageService } from './canvasImage';

fdescribe('XRayService', () => {
  let service: xrayImageService;
  const httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
  const endPointSpy = jasmine.createSpyObj('ApiEndPointService', [
    'getPatientImage',
    'getPatientInstanceId',
  ]);

  beforeEach(() => {
    service = new xrayImageService(httpSpy, endPointSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getPatientImage', () => {
    beforeEach(() => {
      service.getPatientImage(1004);
    });
    it('should call getPatientImage function', () => {});
  });

  describe('#getPatientInstanceId', () => {
    beforeEach(() => {
      service.getPatientInstanceId(1004);
    });
    it('should call getPatientInstanceId function', () => {});
  });
});
