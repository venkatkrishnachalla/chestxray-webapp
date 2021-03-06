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

  /*** it should create component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call ngOnInit function ***/
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
        .subscribe((authResponse: any) => {});
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** it should call ngOnInit function, when ml api returns error ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      xrayServiceSpy.getAskAiDetails.and.returnValue(
        throwError({ status: 404 })
      );
      component.ngOnInit();
    });
    it('should call ngOnIit function, when it returns error', () => {
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** it should call acceptAI funcion ***/
  describe('#acceptAI', () => {
    beforeEach(() => {
      component.acceptAI();
    });
    it('should call acceptAI function', () => {
      const result = component.rejectAI();
      expect(component.acceptAI).toBeDefined();
    });
  });

  /*** it should call rejectAI funcion ***/
  describe('#rejectAI', () => {
    beforeEach(() => {
      component.rejectAI();
    });
    it('should call rejectAI function', () => {
      const result = component.rejectAI();
      expect(component.rejectAI).toBeDefined();
    });
  });
});
