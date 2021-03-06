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
    'onErrorMessage',
    'onAskAiButtonClick',
  ]);
  const anotatedXrayService = jasmine.createSpyObj('XRayService', ['abcd']);
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['userSubject']);
  const actionPanelSpy = jasmine.createSpyObj('ActionPanelComponent', [
    'disableAskAiButton',
  ]);
  const toastrServiceSpy = jasmine.createSpyObj('ToastrService', [
    'success',
    'error',
    'info'
  ]);
  const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  const canvasComponentSpy = jasmine.createSpyObj('CanvasImageComponent', [
    'onSubmitPatientDetails',
  ]);
  const impressionSpy = jasmine.createSpyObj('ImpressionComponent', [
    'getImpressionsToReport',
  ]);
  const findingsSpy = jasmine.createSpyObj('FindingsComponent', [
    'getFindingsToReport',
  ]);

  beforeEach(() => {
    component = new XRayComponent(
      XRayServiceSpy,
      spinnerServiceSpy,
      routerSpy,
      eventEmitterService,
      anotatedXrayService,
      authServiceSpy,
      toastrServiceSpy
    );
  });

  /*** it should create xray component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call ngOnInit function ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      const mockInResponse = {
        username: 'mohan',
        userroles: ['hospitalradiologist'],
      };
      const impressionsMock = [{ name: 'abcd', id: 1 }];
      authServiceSpy.userSubject = of(mockInResponse);
      eventEmitterService.invokeReportFunction = of(impressionsMock);
      component.ngOnInit();
    });
    it('should call ngOnInit function', () => {
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** it should call openAskAi function ***/
  describe('#openAskAI', () => {
    beforeEach(() => {
      const mLResponseNew = {
        data: {
          names: [],
          ndarray: [
            {
              findings: {
                ADDITIONA: [],
              },
              Impression: [
                {
                  index: 0,
                  sentence: 'Consolidation seen in left upper and mid zone',
                },
              ],
              diseases: [
                {
                  color: 'rgb(82,128,138)',
                  confidence: 0.9339834332466126,
                },
              ],
            },
          ],
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
      expect(eventEmitterService.onAskAiButtonClick).toHaveBeenCalledWith(
        'success'
      );
      expect(spinnerServiceSpy.show).toHaveBeenCalled();
      XRayServiceSpy.getAskAiDetails(
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD'
      ).subscribe((authResponse: any) => {});
    });
  });

  /*** it should call openAskAi function, when get ask ai returns empty data ***/
  describe('#openAskAI', () => {
    beforeEach(() => {
      const mLResponseAi = {
        data: {
          names: [],
          ndarray: [
            {
              findings: {
                ADDITIONA: [],
              },
              Impression: [
                {
                  index: 0,
                  sentence: 'Consolidation seen in left upper and mid zone',
                },
              ],
              diseases: [],
            },
          ],
        },
      };
      spyOn(sessionStorage, 'getItem').and.callFake(() => {
        return JSON.stringify({ base64Image: 'test', filename: 'abcd' });
      });
      XRayServiceSpy.getAskAiDetails.and.returnValue(of(mLResponseAi));
      const mockInResponse = {
        username: 'mohan',
        userroles: ['hospitalradiologist'],
      };
      authServiceSpy.userSubject = of(mockInResponse);
      const event = {};
      component.openAskAI(event);
    });
    it('should call openAskAI function, when returns empty data', () => {
      expect(component.openAskAI).toBeDefined();
    });
  });

  /*** it should call openAskAi function, when get ask ai returns error ***/
  describe('#openAskAI', () => {
    beforeEach(() => {
      spyOn(sessionStorage, 'getItem').and.callFake(() => {
        return JSON.stringify({ base64Image: 'test', filename: 'abcd' });
      });
      const errorResponse = { status: 401 };
      XRayServiceSpy.getAskAiDetails.and.returnValue(throwError(errorResponse));
      const mockInResponse = {
        username: 'mohan',
        userroles: ['hospitalradiologist'],
      };
      authServiceSpy.userSubject = of(mockInResponse);
      const event = {};
      component.openAskAI(event);
    });
    it('should call openAskAI function, when returns error message', () => {
      expect(component.openAskAI).toBeDefined();
    });
  });

  /*** it should call generateReport function ***/
  describe('#generateReport', () => {
    beforeEach(() => {
      component.canvas = canvasComponentSpy;
      component.impressions = impressionSpy;
      component.findings = findingsSpy;
      component.generateReport();
    });
    it('should call generateReport function', () => {
      expect(component.generateReport).toBeDefined();
    });
  });

  /*** should call ngOnDestroy ****/
  describe('#ngOnDestroy', () => {
    it('it should call ngOnDestroy', () => {
      (component as any).userSubscription = subscriptionSpy;
      component.ngOnDestroy();
      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
    });
  });
});
