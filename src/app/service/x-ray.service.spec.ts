import { TestBed } from '@angular/core/testing';

import { XRayService } from './x-ray.service';

describe('XRayService', () => {
  let service: XRayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XRayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
