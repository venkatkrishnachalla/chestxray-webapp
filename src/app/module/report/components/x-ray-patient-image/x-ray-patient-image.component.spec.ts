import { XRayPatientImageComponent } from './x-ray-patient-image.component';
import { of, throwError } from 'rxjs';

describe('XRayPatientImageComponent', () => {
  let component: XRayPatientImageComponent;
  const annotatedXrayServiceSpy = jasmine.createSpyObj('XRayService', [
    'getAnnotatedImageData',
  ]);

  beforeEach(() => {
    component = new XRayPatientImageComponent(annotatedXrayServiceSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      const imageMock = 'data64/image:abcdefh';
      annotatedXrayServiceSpy.getAnnotatedImageData.and.returnValue(
        of(imageMock)
      );
    });
    it('should call ngOnIit function', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
    it('should call ngOnIit function, when getAnnotatedImageData returns error', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });
});
