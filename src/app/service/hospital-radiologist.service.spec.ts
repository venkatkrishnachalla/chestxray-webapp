import { TestBed } from '@angular/core/testing';

import { HospitalRadiologistService } from './hospital-radiologist.service';

describe('HospitalRadiologistService', () => {
  let service: HospitalRadiologistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HospitalRadiologistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
