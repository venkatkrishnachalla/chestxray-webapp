import { TestBed } from '@angular/core/testing';

import { EventEmitterService } from './event-emitter.service';

describe('EventEmitterService', () => {
  let service: EventEmitterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventEmitterService);
  });

  /*** it should create service ***/
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /*** it should call onComponentButtonClick function ***/
  it('should call onComponentButtonClick function', () => {
    const result = service.onComponentButtonClick('');
    expect(service.onComponentButtonClick).toBeDefined();
  });

  /*** it should call onComponentDataShared function ***/
  it('should call onComponentDataShared function', () => {
    const result = service.onComponentDataShared('');
    expect(service.onComponentDataShared).toBeDefined();
  });

  /*** it should call onComponentEllipseDataShared function ***/
  it('should call onComponentEllipseDataShared function', () => {
    const result = service.onComponentEllipseDataShared('');
    expect(service.onComponentEllipseDataShared).toBeDefined();
  });

  /*** it should call onComponentReportButtonClick function ***/
  it('should call onComponentReportButtonClick function', () => {
    const result = service.onComponentReportButtonClick('');
    expect(service.onComponentReportButtonClick).toBeDefined();
  });

  /*** it should call onReportDataShared function ***/
  it('should call onReportDataShared function', () => {
    const result = service.onReportDataShared('');
    expect(service.onReportDataShared).toBeDefined();
  });

  /*** it should call onReportDataPatientDataShared function ***/
  it('should call onReportDataPatientDataShared function', () => {
    const result = service.onReportDataPatientDataShared('');
    expect(service.onReportDataPatientDataShared).toBeDefined();
  });

  /*** it should call onErrorMessage function ***/
  it('should call onErrorMessage function', () => {
    const result = service.onErrorMessage('');
    expect(service.onErrorMessage).toBeDefined();
  });

  /*** it should call onImpressionDataShared function ***/
  it('should call onImpressionDataShared function', () => {
    const result = service.onImpressionDataShared('');
    expect(service.onImpressionDataShared).toBeDefined();
  });
});
