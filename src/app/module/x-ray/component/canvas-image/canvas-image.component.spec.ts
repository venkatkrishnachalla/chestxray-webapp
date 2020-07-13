import { CanvasImageComponent } from './canvas-image.component';
import { of } from 'rxjs';

describe('CanvasImageComponent', () => {
  let component: CanvasImageComponent;
  const spinnerServiceSpy = jasmine.createSpyObj('SpinnerService', [
    'show',
    'hide',
  ]);
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'invokeComponentFunction',
    'onComponentButtonClick',
    'onComponentDataShared',
    'onComponentEllipseDataShared',
    'subsVar',
  ]);
  const dialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
  const xRayServiceSpy = jasmine.createSpyObj('xrayImageService', [
    'getPatientInstanceId',
    'getPatientImage',
  ]);
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
  const annotatedXrayServiceSpy = jasmine.createSpyObj('XRayService', [
    'xrayAnnotatedService',
  ]);
  const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);

  beforeEach(() => {
    component = new CanvasImageComponent(
      spinnerServiceSpy,
      eventEmitterServiceSpy,
      dialogSpy,
      xRayServiceSpy,
      annotatedXrayServiceSpy,
      routerSpy
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onResize', () => {
    beforeEach(() => {
      spyOn(component, 'setCanvasDimension');
      spyOn(component, 'setCanvasBackground');
      component.onResize();
    });
    it('should call onResize function', () => {
      expect(component.setCanvasDimension).toHaveBeenCalled();
      expect(component.setCanvasBackground).toHaveBeenCalled();
    });
  });

  describe('#setCanvasDimension', () => {
    beforeEach(() => {
      component.canvas = {
        setDimensions: () => {},
      };
      const controlCheckbox = ({
        clientWidth: '146',
        accessKey: '',
        accessKeyLabel: '',
      } as unknown) as HTMLElement;
      spyOn(document, 'getElementById').and.returnValue(controlCheckbox);
      component.setCanvasDimension();
    });
    it('should call setCanvasDimension function', () => {
      expect(component.setCanvasDimension).toBeDefined();
    });
  });

  describe('#getPatientImage', () => {
    beforeEach(() => {
      component.canvas = {
        setDimensions: () => {},
        setWidth: () => {},
        setHeight: () => {},
        renderAll: () => {},
        setBackgroundImage: () => {},
      };
      const controlCheckbox = ({
        clientWidth: '146',
        accessKey: '',
        accessKeyLabel: '',
      } as unknown) as HTMLElement;
      const patientMock = [{ patientId: 1234, name: 'abcde' }];
      const PatientImageMock = 'abcdeffff';
      xRayServiceSpy.getPatientImage.and.returnValue(of(PatientImageMock));
      spyOn(document, 'getElementById').and.returnValue(controlCheckbox);
      component.getPatientImage('12662');
    });
    it('should call getPatientImage function', () => {
      expect(component.getPatientImage).toBeDefined();
    });
  });

  describe('#generateCanvas', () => {
    beforeEach(() => {
      component.canvas = {
        setWidth: () => {},
        setHeight: () => {},
        setBackgroundImage: () => {},
        renderAll: () => {},
      };
      component.canvasDynamicWidth = 893;
      component.canvasDynamicHeight = 549;
      component.xRayImage = {
        width: 2000,
        height: 1650,
        set: () => {},
      };
      component.generateCanvas();
    });
    it('should call generateCanvas function', () => {
      expect(component.generateCanvas).toBeDefined();
    });
  });

  describe('#setCanvasBackground', () => {
    beforeEach(() => {
      component.canvas = {
        setWidth: () => {},
        setHeight: () => {},
        setBackgroundImage: () => {},
        renderAll: () => {},
      };
      component.canvasDynamicWidth = 893;
      component.canvasDynamicHeight = 549;
      component.xRayImage = {
        width: 2000,
        height: 1650,
        set: () => {},
      };
      component.setCanvasBackground();
    });
    it('should call setCanvasBackground function', () => {
      expect(component.setCanvasBackground).toBeDefined();
    });
  });

  describe('#setCanvasBackground', () => {
    beforeEach(() => {
      component.canvas = {
        setWidth: () => {},
        setHeight: () => {},
        setBackgroundImage: () => {},
        renderAll: () => {},
      };
      component.canvasDynamicWidth = 893;
      component.canvasDynamicHeight = 968;
      component.xRayImage = {
        width: 2000,
        height: 1650,
        set: () => {},
      };
      component.setCanvasBackground();
    });
    it('should call setCanvasBackground function, when height first', () => {
      expect(component.setCanvasBackground).toBeDefined();
    });
  });

  describe('#onProcessClickHandler', () => {
    beforeEach(() => {
      const patientMockInstanceId = [
        {
          accessionNumber: '',
          id: '9cb6a32f-93a4cee8-ee9f0ef3-3cc29b03-f6a0bfe8',
          referringPhysicianName: 'mohan',
          seriesList: [
            {
              bodyPartExamined: null,
              id: '9b247ba4-b9899974-878bb3e3-001ed405-48084c1f',
              instanceList: [
                {
                  id: '42066719-369f0249-189d2017-c3bd3f57-11fc78d6',
                  instanceNumber: 0,
                  instanceDate: '0001-01-01T00:00:00',
                },
              ],
              seriesDate: '0001-01-01T00:00:00',
              seriesDescription: null,
              seriesNumber: 0,
            },
          ],
          studyDate: '2019-11-11T00:00:00',
          studyDescription: null,
        },
      ];
      xRayServiceSpy.getPatientInstanceId.and.returnValue(
        of(patientMockInstanceId)
      );
      spyOn(component, 'getPatientImage');
      component.getPatientInstanceId(
        'dd019039-21ea2494-1c26a48f-2cec24e0-bb0e8cc7'
      );
    });
    it('should call getPatientInstanceId function', () => {
      expect(component.getPatientInstanceId).toBeDefined();
      expect(component.getPatientImage).toHaveBeenCalled();
    });
  });

  describe('#getPatientImage', () => {
    beforeEach(() => {
      const patientMockImage =
        'data:image/jpeg;base64,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';
      xRayServiceSpy.getPatientImage.and.returnValue(of(patientMockImage));
      spyOn(component, 'setCanvasDimension');
      spyOn(component, 'generateCanvas');
      component.getPatientImage('d49f984a-f9fcdb9c-4b6bd590-4f4afe83-cb1568b4');
    });
    it('should call getPatientImage function', () => {
      expect(component.getPatientImage).toBeDefined();
      expect(component.setCanvasDimension).toHaveBeenCalled();
      expect(component.generateCanvas).toHaveBeenCalled();
    });
  });

  describe('#getPatientInstanceId', () => {
    beforeEach(() => {
      const patientMockInstanceId = [
        {
          accessionNumber: '',
          id: '9cb6a32f-93a4cee8-ee9f0ef3-3cc29b03-f6a0bfe8',
          referringPhysicianName: 'mohan',
          seriesList: [
            {
              bodyPartExamined: null,
              id: '9b247ba4-b9899974-878bb3e3-001ed405-48084c1f',
              instanceList: [
                {
                  id: '42066719-369f0249-189d2017-c3bd3f57-11fc78d6',
                  instanceNumber: 0,
                  instanceDate: '0001-01-01T00:00:00',
                },
              ],
              seriesDate: '0001-01-01T00:00:00',
              seriesDescription: null,
              seriesNumber: 0,
            },
          ],
          studyDate: '2019-11-11T00:00:00',
          studyDescription: null,
        },
      ];
      xRayServiceSpy.getPatientInstanceId.and.returnValue(
        of(patientMockInstanceId)
      );
      spyOn(component, 'getPatientImage');
      component.getPatientInstanceId(
        'dd019039-21ea2494-1c26a48f-2cec24e0-bb0e8cc7'
      );
    });
    it('should call getPatientInstanceId function', () => {
      expect(component.getPatientInstanceId).toBeDefined();
      expect(component.getPatientImage).toHaveBeenCalled();
    });
  });

  describe('#getPatientImage', () => {
    beforeEach(() => {
      const patientMockImage =
        'data:image/jpeg;base64,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';
      xRayServiceSpy.getPatientImage.and.returnValue(of(patientMockImage));
      spyOn(component, 'setCanvasDimension');
      spyOn(component, 'generateCanvas');
      component.getPatientImage('d49f984a-f9fcdb9c-4b6bd590-4f4afe83-cb1568b4');
    });
    it('should call getPatientImage function', () => {
      expect(component.getPatientImage).toBeDefined();
      expect(component.setCanvasDimension).toHaveBeenCalled();
      expect(component.generateCanvas).toHaveBeenCalled();
    });
  });
  describe('#firstComponentFunction', () => {
    beforeEach(() => {
      component.firstComponentFunction('test');
    });
    it('should call firstComponentFunction function', () => {
      expect(component.firstComponentFunction).toBeDefined();
    });
  });
  describe('#deleteEllipse', () => {
    beforeEach(() => {
      component.canvas = {
        getActiveObject: () => {
          return { id: 5 };
        },
      };
      component.deleteEllipse();
    });
    it('should call deleteEllipse function', () => {
      expect(component.deleteEllipse).toBeDefined();
    });
  });

  describe('#deleteEllipse', () => {
    beforeEach(() => {
      component.canvas = {
        getActiveObject: () => {},
      };
      component.deleteEllipse();
    });
    it('should call deleteEllipse function, when no select object found', () => {
      expect(component.deleteEllipse).toBeDefined();
    });
  });

  describe('#deletePrediction', () => {
    beforeEach(() => {
      component.canvas = {
        remove: () => {},
        getActiveObject: () => {
          return {
            id: 1,
          };
        },
      };
      component.deletePrediction();
    });
    it('should call deletePrediction function', () => {
      expect(component.deletePrediction).toBeDefined();
    });
  });
  describe('#openPathologyModal', () => {
    beforeEach(() => {
      component.openPathologyModal();
    });
    it('should call openPathologyModal function', () => {
      expect(component.openPathologyModal).toBeDefined();
    });
  });
  describe('#onSelect', () => {
    beforeEach(() => {
      component.onSelect('', 'text');
    });
    it('should call onSelect function', () => {
      expect(component.onSelect).toBeDefined();
    });
  });
  describe('#savePrediction', () => {
    beforeEach(() => {
      component.canvas = {
        getActiveObject: () => {
          return {
            id: 1,
          };
        },
      };
      component.activeIcon = {
        active: true,
      };
      component.savePrediction();
    });
    it('should call savePrediction function', () => {
      expect(component.savePrediction).toBeDefined();
    });
  });
  describe('#closePathologyModal', () => {
    beforeEach(() => {
      component.canvas = {
        remove: () => {},
        getActiveObject: () => {
          return {
            id: 1,
          };
        },
        renderAll: () => {},
      };
      component.activeIcon = {
        active: true,
      };
      component.closePathologyModal();
    });
    it('should call closePathologyModal function', () => {
      expect(component.closePathologyModal).toBeDefined();
    });
  });
  describe('#freeHandDrawing', () => {
    beforeEach(() => {
      component.canvas = {
        remove: () => {},
        getActiveObject: () => {
          return {
            id: 1,
          };
        },
        isDrawingMode: true,
        freeDrawingBrush: {
          width: '',
          color: '',
        },
        observe: () => {},
      };
      const mockData = {
        active: true,
      };
      component.freeHandDrawing(mockData);
    });
    it('should call freeHandDrawing function', () => {
      expect(component.freeHandDrawing).toBeDefined();
    });
  });

  describe('#freeHandDrawing', () => {
    beforeEach(() => {
      component.canvas = {
        remove: () => {},
        getActiveObject: () => {
          return {
            id: 1,
          };
        },
        isDrawingMode: true,
        freeDrawingBrush: {
          width: '',
          color: '',
        },
        observe: () => {},
      };
      const mockData = {
        active: false,
      };
      component.freeHandDrawing(mockData);
    });
    it('should call freeHandDrawing function, when data active is false', () => {
      expect(component.freeHandDrawing).toBeDefined();
    });
  });

  describe('#mlApiEllipseLoop', () => {
    beforeEach(() => {
      const mLResponseNew = {
        data: {
          names: [],
          ndarray: [
            {
              Findings: {
                ADDITIONAL: [],
                'BONY THORAX': [],
                'CARDIAC SILHOUETTE': [],
                COSTOPHRENIC_ANGLES: [],
                'DOMES OF DIAPHRAGM': [],
                'HILAR/MEDIASTINAL': [],
                'LUNG FIELDS': [0, 1],
              },
              Impression: [
                [0, 'calcification'],
                [1, 'consolidation'],
              ],
              diseases: [
                {
                  color: 'rgb(230,25,75)',
                  confidence: 0.9941253662109375,
                  contours: [],
                  ellipses: [
                    {
                      a: 253,
                      b: 453,
                      r: 0,
                      x: 946,
                      y: 348,
                    },
                  ],
                  idx: 0,
                  name: 'Calcification',
                },
                {
                  color: 'rgb(60,180,75)',
                  confidence: 0.9983514547348022,
                  contours: [],
                  ellipses: [
                    {
                      a: 153,
                      b: 353,
                      r: 0,
                      x: 716,
                      y: 278,
                    },
                  ],
                  idx: 1,
                  name: 'Consolidation',
                },
              ],
            },
          ],
        },
        meta: {},
      };
      component.canvas = {
        getActiveObject: () => {},
        add: () => {},
        renderAll: () => {},
        setActiveObject: () => {},
        isDrawingMode: true,
      };
      component.xRayImage = {
        width: 2000,
        height: 1650,
        set: () => {},
      };
      eventEmitterServiceSpy.onComponentEllipseDataShared.and.returnValue(
        of({})
      );
      component.mlApiEllipseLoop(mLResponseNew);
    });
    it('should call mlApiEllipseLoop function', () => {
      expect(component.mlApiEllipseLoop).toBeDefined();
      expect(
        eventEmitterServiceSpy.onComponentEllipseDataShared
      ).toHaveBeenCalled();
    });
  });

  describe('#ngOnDestroy', () => {
    it('it should call ngOnDestroy', () => {
      (component as any).eventsSubscription = subscriptionSpy;
      component.ngOnDestroy();
      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('#drawEllipse', () => {
    it('it should call drawEllipse', () => {
      component.canvas = {
        getActiveObject: () => {},
        add: () => {},
        renderAll: () => {},
        setActiveObject: () => {},
        isDrawingMode: true,
      };
      component.drawEllipse({}, undefined, undefined);
      expect(component.drawEllipse).toBeDefined();
    });
  });

  describe('#drawEllipse', () => {
    it('it should call drawEllipse, when active icon is true', () => {
      const mockdata = {
        active: true,
      };
      component.canvas = {
        getActiveObject: () => {},
        add: () => {},
        renderAll: () => {},
        setActiveObject: () => {},
        isDrawingMode: true,
        observe: () => {},
      };
      component.drawEllipse(mockdata, undefined, undefined);
      expect(component.drawEllipse).toBeDefined();
    });
  });

  describe('#updatePrediction', () => {
    it('it should call updatePrediction', () => {
      component.canvas = {
        getActiveObject: () => {
          return { id: 1 };
        },
      };
      component.updatePrediction();
      expect(component.updatePrediction).toBeDefined();
    });
  });

  describe('#save', () => {
    it('it should call save', () => {
      component.canvas = {
        getActiveObject: () => {},
        isDrawingMode: true,
      };
      component.save();
      expect(component.save).toBeDefined();
    });
  });

  describe('#updateEllipse', () => {
    it('it should call updateEllipse', () => {
      component.updateEllipse();
      expect(component.updateEllipse).toBeDefined();
    });
  });

  describe('#onSubmitPatientDetails', () => {
    it('it should call onSubmitPatientDetails', () => {
      component.canvas = {
        toDataURL: '',
      };
      component.processedImage = 'data64:abcde';
      component.onSubmitPatientDetails();
      expect(annotatedXrayServiceSpy.xrayAnnotatedService).toHaveBeenCalledWith(
        component.processedImage
      );
      expect(component.onSubmitPatientDetails).toBeDefined();
    });
  });
});
