import { AskAiToolComponent } from './ask-ai-tool.component';
import { of } from 'rxjs';

describe('AskAiToolComponent', () => {
  let component: AskAiToolComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'invokeAskAiButtonDataFunction',
    'invokePrevNextButtonDataFunction',
  ]);
  const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);

  beforeEach(() => {
    const patientIdMock = '4df09ebb-adb7-4d81-a7e0-7d108ceb8f08';
    eventEmitterServiceSpy.invokeAskAiButtonDataFunction = of('success');
    eventEmitterServiceSpy.invokePrevNextButtonDataFunction = of(patientIdMock);
    component = new AskAiToolComponent(eventEmitterServiceSpy);
  });

  /*** it should create report component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call AskAiToolComponent class ngOnInit ***/
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

  /*** it should call disableAskAiButton event ***/
  describe('#disableAskAiButton', () => {
    beforeEach(() => {
      component.disableAskAI = true;
      component.disableAskAiButton();
    });
    it('should call icon Action function', () => {
      expect(component.disableAskAiButton).toBeDefined();
    });
  });

  /*** it should call askAi event ***/
  describe('#askAI', () => {
    beforeEach(() => {
      component.askAI();
    });
    it('should call ask ai function,', () => {
      expect(component.askAI).toBeDefined();
    });
  });

  /*** it should call ngOnDestroy function ***/
  describe('#ngOnDestroy', () => {
    it('it should call ngOnDestroy', () => {
      (component as any)._subscription = subscriptionSpy;
      component.ngOnDestroy();
      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
    });
  });
});
