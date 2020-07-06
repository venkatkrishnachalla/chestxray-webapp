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
});
