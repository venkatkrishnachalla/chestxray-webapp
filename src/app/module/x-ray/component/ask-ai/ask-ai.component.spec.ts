import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskAiComponent } from './ask-ai.component';
import { XRayService } from 'src/app/service/x-ray.service';

describe('AskAiComponent', () => {
  let component: AskAiComponent;
  let XRayServiceSpy:jasmine.SpyObj<XRayService>

  beforeEach(() => {
    XRayServiceSpy = jasmine.createSpyObj('XRayService', []);
  });

  TestBed.configureTestingModule({
    declarations: [AskAiComponent],
    providers:[{
      provide: XRayService, usevalue: XRayServiceSpy
    }]
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should call ngOnIit function', () => {
      const result = component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  describe('#rejectAI', () => {
    beforeEach(() => {
      // spyOn(component, 'askAIEvent').and.callThrough();
      component.rejectAI();
    });
    it('should call rejectAI function', () => {
      const result = component.rejectAI();
      expect(component.rejectAI).toBeDefined();
    });
  });
});
