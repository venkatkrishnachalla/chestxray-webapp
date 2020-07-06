import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { xrayImageService } from './canvasImage';

describe('XRayService', () => {
  let service: xrayImageService;
  const httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
  // const endPointSpy = jasmine.createSpyObj('ApiEndPointService', [
  //   'getPatientImage',
  //   'getPatientInstanceId',
  // ]);

  beforeEach(() => TestBed.configureTestingModule({
    imports: [httpSpy],
    providers:[xrayImageService]
  }));

  it('should be created', () => {
    // const service: xrayImageService = TestBed.get(xrayImageService);
    expect(service).toBeTruthy();
  });
});
