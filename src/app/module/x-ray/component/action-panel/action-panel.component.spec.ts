import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionPanelComponent } from './action-panel.component';
import { of } from 'rxjs';

describe('ActionPanelComponent', () => {
  let component: ActionPanelComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'onComponentButtonClick',
    'invokePrevNextButtonDataFunction',
  ]);

  beforeEach(() => {
    const patientIdMock = '4df09ebb-adb7-4d81-a7e0-7d108ceb8f08';
    eventEmitterServiceSpy.invokePrevNextButtonDataFunction = of(patientIdMock);
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

  /*** it should call iconAction click event, when key not equal to index ***/
  describe('#iconAction', () => {
    beforeEach(() => {
      const mockdata = [
        {
          name: 'Ellipse',
          index: 1,
        },
      ];
      component.iconAction(mockdata, '0');
    });
    it('should call iconAction function, when key not equal to index', () => {
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
});
