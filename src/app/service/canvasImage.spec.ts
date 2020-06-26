import { TestBed } from '@angular/core/testing';

import { xrayImageService } from './canvasImage';

describe('XRayService', () => {
  let service: xrayImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(xrayImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
