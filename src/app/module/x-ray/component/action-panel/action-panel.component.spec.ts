import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPanelComponent } from './action-panel.component';

describe('ActionPanelComponent', () => {
  let component: ActionPanelComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', ['onComponentButtonClick']);

  beforeEach(() => {
    component = new ActionPanelComponent(
      eventEmitterServiceSpy
    );
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

  describe('#askAI', () => {
    beforeEach(() => {
      component.iconAction([], 1)
    });
    it('should call icon Action function', () => {
      const result = component.iconAction([], 1);
      expect(component.iconAction).toBeDefined();
    });
  });

});
