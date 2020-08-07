import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPanelComponent } from './action-panel.component';

describe('ActionPanelComponent', () => {
  let component: ActionPanelComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'onComponentButtonClick',
  ]);

  beforeEach(() => {
    component = new ActionPanelComponent(eventEmitterServiceSpy);
  });

  /*** it should create report component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call ngOnInit ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should call ngOnIit function', () => {
      const result = component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** it should call askAI event ***/
  describe('#askAI', () => {
    beforeEach(() => {
      component.askAI();
    });
    it('should call askAI function', () => {
      const result = component.askAI();
      expect(component.askAI).toBeDefined();
    });
  });

  /*** it should call askAi event, when index is 0 ***/
  describe('#askAI', () => {
    beforeEach(() => {
      const data = [
        {
          active: true,
          key: 0,
          index: 0,
        },
      ];
      component.iconAction(data, 0);
    });
    it('should call icon Action function', () => {
      expect(component.iconAction).toBeDefined();
    });
  });

  /*** it should call askAi event, when index not equal to key ***/
  describe('#askAI', () => {
    beforeEach(() => {
      const data = [
        {
          active: true,
          key: 0,
          index: 1,
        },
      ];
      component.iconAction(data, 0);
    });
    it('should call icon Action function, when index is not equal to key', () => {
      expect(component.iconAction).toBeDefined();
    });
  });

  /*** it should call disableAskAiButton event ***/
  describe('#disableAskAiButton', () => {
    it('should call disableAskAiButton function', () => {
      component.disableAskAiButton();
      expect(component.disableAskAI).toEqual(true);
    });
  });
});
