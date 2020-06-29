import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskAiComponent } from './ask-ai.component';

describe('AskAiComponent', () => {
  let component: AskAiComponent;

  beforeEach(() => {
    component = new AskAiComponent(
    );
  });

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
