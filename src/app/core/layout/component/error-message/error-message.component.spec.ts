import { ErrorMessageComponent } from './error-message.component';
import { of } from 'rxjs';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'invokeDisplayErrorMessage',
  ]);

  beforeEach(() => {
    component = new ErrorMessageComponent(eventEmitterServiceSpy);
  });

  /*** expects error message component to be truthy ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** ngOnInit function test case ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      const errorResponse = {
        data: {
          status: 404,
        },
        error: {
          error: {
            message: 'Not Found',
          },
        },
      };
      eventEmitterServiceSpy.invokeDisplayErrorMessage = of(errorResponse);
      component.ngOnInit();
    });
    it('should call ngOnInit function', () => {
      expect(component.showError).toEqual(true);
    });
  });

  /*** ngOnInit function test case, when error code is 204 ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      const errorResponse = {
        data: {
          status: 204,
        },
        error: {
          error: {
            message: 'No Content',
          },
        },
      };
      eventEmitterServiceSpy.invokeDisplayErrorMessage = of(errorResponse);
      component.ngOnInit();
    });
    it('should call ngOnInit function, when error message is 204', () => {
      expect(component.showError).toEqual(true);
    });
  });

  /*** ngOnInit function test case, when error code is 401 ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      const errorResponse = {
        data: {
          status: 401,
        },
        error: {
          error: {
            message: 'Unauthorized',
          },
        },
      };
      eventEmitterServiceSpy.invokeDisplayErrorMessage = of(errorResponse);
      component.ngOnInit();
    });
    it('should call ngOnInit function, when error message is 401', () => {
      expect(component.showError).toEqual(true);
    });
  });

  /*** ngOnInit function test case, when error code is 403 ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      const errorResponse = {
        data: {
          status: 403,
        },
        error: {
          error: {
            message: 'Forbidden',
          },
        },
      };
      eventEmitterServiceSpy.invokeDisplayErrorMessage = of(errorResponse);
      component.ngOnInit();
    });
    it('should call ngOnInit function, when error message is 403', () => {
      expect(component.showError).toEqual(true);
    });
  });

  /*** ngOnInit function test case, when error code is 500 ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      const errorResponse = {
        data: {
          status: 500,
        },
        error: {
          error: {
            message: 'Internal Server Error',
          },
        },
      };
      eventEmitterServiceSpy.invokeDisplayErrorMessage = of(errorResponse);
      component.ngOnInit();
    });
    it('should call ngOnInit function, when error message is 500', () => {
      expect(component.showError).toEqual(true);
    });
  });
});
