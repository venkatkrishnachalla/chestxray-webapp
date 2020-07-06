import { XRayComponent } from './x-ray.component';
import { of, throwError } from 'rxjs';

fdescribe('XRayComponent', () => {
  let component: XRayComponent;
  const spinnerServiceSpy = jasmine.createSpyObj('SpinnerService', [
    'show',
    'hide',
  ]);
  const XRayServiceSpy = jasmine.createSpyObj('XRayService', [
    'getAskAiDetails',
  ]);

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

  describe('#openAskAI', () => {
    const mock = {
      data: {
        ndarray: [],
      },
    };
    beforeEach(() => {
      XRayServiceSpy.getAskAiDetails.and.returnValue(of(mock));
      const event = {};
      component.openAskAI(event);
    });
    it('should call openAskAI function', () => {
      expect(spinnerServiceSpy.show).toHaveBeenCalled();
      XRayServiceSpy.getAskAiDetails('test').subscribe((xrayResponse: any) => {
        expect(xrayResponse).toEqual(mock);
        expect(spinnerServiceSpy.hide).toHaveBeenCalled();
      });
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
      expect(spinnerServiceSpy.hide).toHaveBeenCalled();
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
