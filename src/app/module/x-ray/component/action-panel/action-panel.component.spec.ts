import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPanelComponent } from './action-panel.component';

describe('ActionPanelComponent', () => {
  let component: ActionPanelComponent;

  beforeEach(() => {
    component = new ActionPanelComponent(
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

  describe('#askAI', () => {
    beforeEach(() => {
      // spyOn(component, 'askAIEvent').and.callThrough();
      component.askAI();
    });
    it('should call askAI function', () => {
      const result = component.askAI();
      expect(component.askAI).toBeDefined();
    });
  });

});
