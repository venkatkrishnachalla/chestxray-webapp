import { XRayComponent } from './x-ray.component';
import { of, throwError } from 'rxjs';

describe('XRayComponent', () => {
  let component: XRayComponent;
  const spinnerServiceSpy = jasmine.createSpyObj('SpinnerService', [
    'show',
    'hide',
  ]);
  const XRayServiceSpy = jasmine.createSpyObj('XRayService', [
    'getAskAiDetails',
  ]);
  const routerSpy = jasmine.createSpyObj('Router', [
    'naviagate',
  ]);
  const eventEmitterService = jasmine.createSpyObj('XRayService', [
    'invokeReportFunction',
    'onReportDataShared',
    'onComponentReportButtonClick'
  ]);
  const anotatedXrayService = jasmine.createSpyObj('XRayService', [
    'abcd',
  ]);
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['userSubject']);

  beforeEach(() => {
    component = new XRayComponent(XRayServiceSpy, spinnerServiceSpy, routerSpy, eventEmitterService, anotatedXrayService, authServiceSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#openAskAI', () => {
    beforeEach(() => {
      const mLResponseNew = {
        data: {
          names: [],
          ndarray: [{}],
        },
      };
      XRayServiceSpy.getAskAiDetails.and.returnValue(of(mLResponseNew));
      const event = {};
      component.openAskAI(event);
    });
    it('should call openAskAI function, when returns success', () => {
      expect(spinnerServiceSpy.show).toHaveBeenCalled();
      XRayServiceSpy.getAskAiDetails(
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD'
      ).subscribe((authResponse: any) => {});
      expect(spinnerServiceSpy.hide).toHaveBeenCalled();
    });
  });

  describe('#openAskAI', () => {
    beforeEach(() => {
      const errorResponse = { status: 401 };
      XRayServiceSpy.getAskAiDetails.and.returnValue(throwError(errorResponse));
      const event = {};
      component.openAskAI(event);
    });
    it('should call openAskAI function, when returns error message', () => {
      expect(component.openAskAI).toBeDefined();
    });
  });

  // describe('#rejectAI', () => {
  //   beforeEach(() => {
  //     // tslint:disable-next-line: deprecation
  //     component.rejectAI(event);
  //   });
  //   it('should call rejectAI function', () => {
  //     // tslint:disable-next-line: deprecation
  //     const result = component.rejectAI(event);
  //     expect(component.rejectAI).toBeDefined();
  //   });
  // });
});
