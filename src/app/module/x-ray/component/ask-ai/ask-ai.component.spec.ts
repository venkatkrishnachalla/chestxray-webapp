import { AskAiComponent } from './ask-ai.component';
import { of, throwError } from 'rxjs';

describe('AskAiComponent', () => {
  let component: AskAiComponent;
  const xrayServiceSpy = jasmine.createSpyObj('XRayService', [
    'getAskAiDetails',
  ]);

  beforeEach(() => {
    component = new AskAiComponent(xrayServiceSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      const mLResponseNew = {
        data: {
          names: [],
          ndarray: [{}],
        },
      };
      xrayServiceSpy.getAskAiDetails.and.returnValue(of(mLResponseNew));
      component.ngOnInit();
    });
    it('should call ngOnIit function', () => {
      xrayServiceSpy
        .getAskAiDetails('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD')
        .subscribe((authResponse: any) => {
        });
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
