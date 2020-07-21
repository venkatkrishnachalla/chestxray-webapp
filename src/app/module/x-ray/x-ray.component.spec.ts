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
  const routerSpy = jasmine.createSpyObj('Router', ['naviagate']);
  const eventEmitterService = jasmine.createSpyObj('XRayService', [
    'invokeReportFunction',
    'onReportDataShared',
    'onComponentReportButtonClick',
  ]);
  const anotatedXrayService = jasmine.createSpyObj('XRayService', ['abcd']);
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['userSubject']);
  const actionPanelSpy = jasmine.createSpyObj('ActionPanelComponent', ['disableAskAiButton']);

  beforeEach(() => {
    component = new XRayComponent(
      XRayServiceSpy,
      spinnerServiceSpy,
      routerSpy,
      eventEmitterService,
      anotatedXrayService,
      authServiceSpy
    );
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
      spyOn(sessionStorage, 'getItem').and.callFake(() => {
        return JSON.stringify({ base64Image: 'test', filename: 'abcd' });
      });
      XRayServiceSpy.getAskAiDetails.and.returnValue(of(mLResponseNew));
      const mockInResponse = {
        username: 'mohan',
        userroles: ['hospitalradiologist'],
      };
      authServiceSpy.userSubject = of(mockInResponse);
      const event = {};
      component.actionPanel = actionPanelSpy;
      component.openAskAI(event);
    });
    it('should call openAskAI function, when returns success', () => {
      expect(spinnerServiceSpy.show).toHaveBeenCalled();
      XRayServiceSpy.getAskAiDetails(
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD'
      ).subscribe((authResponse: any) => {});
    });
  });

  describe('#openAskAI', () => {
    beforeEach(() => {
      spyOn(sessionStorage, 'getItem').and.callFake(() => {
        return JSON.stringify({ base64Image: 'test', filename: 'abcd' });
      });
      const errorResponse = { status: 401 };
      XRayServiceSpy.getAskAiDetails.and.returnValue(throwError(errorResponse));
      const mockInResponse = {
        username: 'mohan',
        userroles: ['hospitalradiologist']
      };
      authServiceSpy.userSubject = of(mockInResponse);
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
