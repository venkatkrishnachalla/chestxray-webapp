import { TestBed } from '@angular/core/testing';

import { EventEmitterService } from './event-emitter.service';

describe('EventEmitterService', () => {
  let service: EventEmitterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventEmitterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should call onComponentButtonClick function', () => {
    const result = service.onComponentButtonClick('');
    expect(service.onComponentButtonClick).toBeDefined();
  });
  it('should call onComponentDataShared function', () => {
    const result = service.onComponentDataShared('');
    expect(service.onComponentDataShared).toBeDefined();
  });
  it('should call onComponentEllipseDataShared function', () => {
    const result = service.onComponentEllipseDataShared('');
    expect(service.onComponentEllipseDataShared).toBeDefined();
  });
});
