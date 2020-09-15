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

  /*** it should call onComponentFindingsDataShared function ***/
  it('should call onComponentFindingsDataShared function', () => {
    const result = service.onComponentFindingsDataShared('');
    expect(service.onComponentFindingsDataShared).toBeDefined();
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

  /*** it should call onPrevNextButtonClick function ***/
  it('should call onPrevNextButtonClick function', () => {
    const result = service.onPrevNextButtonClick('');
    expect(service.onPrevNextButtonClick).toBeDefined();
  });

  /*** it should call onAskAiButtonClick function ***/
  it('should call onAskAiButtonClick function', () => {
    const result = service.onAskAiButtonClick('');
    expect(service.onAskAiButtonClick).toBeDefined();
  });

  /*** it should call onImpressionCheckboxClick function ***/
  it('should call onImpressionCheckboxClick function', () => {
    const result = service.onImpressionCheckboxClick('');
    expect(service.onImpressionCheckboxClick).toBeDefined();
  });

  /*** it should call onBrightnessChange function ***/
  it('should call onBrightnessChange function', () => {
    const result = service.onBrightnessChange('');
    expect(service.onBrightnessChange).toBeDefined();
  });
  /*** it should call onContrastChange function ***/
  it('should call onContrastChange function', () => {
    const result = service.onContrastChange(50);
    expect(service.onContrastChange).toBeDefined();
  });
  /*** it should call OnDefaultRanges function ***/
  it('should call OnDefaultRanges function', () => {
    const result = service.OnDefaultRanges(50);
    expect(service.OnDefaultRanges).toBeDefined();
  });
});
