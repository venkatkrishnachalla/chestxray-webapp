import { XRayPatientImageComponent } from './x-ray-patient-image.component';
import { of, throwError } from 'rxjs';

describe('XRayPatientImageComponent', () => {
  let component: XRayPatientImageComponent;
  const annotatedXrayServiceSpy = jasmine.createSpyObj('XRayService', [
    'getAnnotatedImageData',
  ]);

  const mockPatientDetail = {
    age: 32,
    birthDate: '1988-05-06T00:00:00',
    hospitalPatientId: '1010',
    id: '1004',
    lastUpdate: '2020-06-29T14:08:59',
    name: 'Pallavi',
    referringPhysicianName: 'mohan',
    sex: 'F',
    status: false,
    studies: ['9cb6a32f-93a4cee8-ee9f0ef3-3cc29b03-f6a0bfe8'],
  };

  beforeEach(() => {
    component = new XRayPatientImageComponent(annotatedXrayServiceSpy);
  });

  /*** it should create xray patient image component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call ngOnInit function ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      const imageMock = 'data64/image:abcdefh';
      annotatedXrayServiceSpy.getAnnotatedImageData.and.returnValue(
        of(imageMock)
      );
    });
    it('should call ngOnIit function', () => {
      window.history.pushState({ patientDetails: mockPatientDetail }, '', '');
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
    it('should call ngOnIit function, when getAnnotatedImageData returns error', () => {
      window.history.pushState({ patientDetails: mockPatientDetail }, '', '');
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** it should call print click event ***/
  describe('#printClick', () => {
    it('should call printClick function', () => {
      component.printClick();
      expect(component.printClick).toBeDefined();
    });
  });
});
