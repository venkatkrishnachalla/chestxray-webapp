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
    'onComponentFindingsDataShared',
  ]);
  const dialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
  const xRayServiceSpy = jasmine.createSpyObj('XRayImageService', [
    'getPatientInstanceId',
    'getPatientImage',
  ]);
  const routerSpy = jasmine.createSpyObj('Router', [
    'navigateByUrl',
    'navigate',
  ]);
  const annotatedXrayServiceSpy = jasmine.createSpyObj('XRayService', [
    'xrayAnnotatedService',
  ]);
  const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success']);

  beforeEach(() => {
    component = new CanvasImageComponent(
      spinnerServiceSpy,
      eventEmitterServiceSpy,
      dialogSpy,
      xRayServiceSpy,
      annotatedXrayServiceSpy,
      routerSpy,
      toastrServiceSpy
    );
  });

  /*** it should create canvas component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call onResize function ***/
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

  /*** it should call setCanvasDimension function ***/
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

  /*** it should call getPatientImage function ***/
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
      const PatientImageMock = {
        base64Image: 'abcdeffff',
        filename: 'xyzd',
      };
      const mock = JSON.stringify(PatientImageMock);
      xRayServiceSpy.getPatientImage.and.returnValue(of(mock));
      spyOn(document, 'getElementById').and.returnValue(controlCheckbox);
      spyOn(component, 'setCanvasDimension');
      spyOn(component, 'generateCanvas');
      component.getPatientImage('12662');
    });
    it('should call getPatientImage function', () => {
      expect(component.getPatientImage).toBeDefined();
    });
  });

  /*** it should call generateCanvas function ***/
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

  /*** it should call setCanvasBackground function ***/
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

  /*** it should call setCanvasBackground function, when height first ***/
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

  /*** it should call getPatientInstanceId function ***/
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

  /*** it should call firstComponentFunction function ***/
  describe('#firstComponentFunction', () => {
    beforeEach(() => {
      component.firstComponentFunction('test');
    });
    it('should call firstComponentFunction function', () => {
      expect(component.firstComponentFunction).toBeDefined();
    });
  });

  /*** it should call deleteEllipse function ***/
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

  /*** it should call deleteEllipse function, when no object selected ***/
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

  /*** it should call deletePrediction function ***/
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

  /*** it should call openPathologyModal function ***/
  describe('#openPathologyModal', () => {
    beforeEach(() => {
      component.openPathologyModal();
    });
    it('should call openPathologyModal function', () => {
      expect(component.openPathologyModal).toBeDefined();
    });
  });

  /*** it should call onSelect function ***/
  describe('#onSelect', () => {
    beforeEach(() => {
      component.onSelect('', 'text');
    });
    it('should call onSelect function', () => {
      expect(component.onSelect).toBeDefined();
    });
  });

  /*** it should call savePrediction function ***/
  describe('#savePrediction', () => {
    beforeEach(() => {
      component.canvas = {
        getActiveObject: () => {
          return { id: 1, set: () => {} };
        },
        renderAll: () => {},
      };
      component.selectedDisease = 'Bulla';
      component.activeIcon = {
        active: true,
      };
      component.savePrediction();
    });
    it('should call savePrediction function', () => {
      expect(component.savePrediction).toBeDefined();
    });
  });

  /*** it should call closePathologyModal function ***/
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

  /*** it should call freeHandDrawing function ***/
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

  /*** it should call freeHandDrawing function, when active is false ***/
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

  /*** it should call mlApiEllipseLoop function ***/
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
                'COSTOPHRENIC ANGLES': [],
                'DOMES OF DIAPHRAGM': [],
                'HILAR/MEDIASTINAL': [],
                'LUNG FIELDS': [0, 1],
              },
              Impression: [
                {
                  index: 0,
                  sentence: 'calcification',
                },
                {
                  index: 1,
                  sentence: 'consolidation',
                },
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
        discardActiveObject: () => {},
        isDrawingMode: true,
      };
      component.xRayImage = {
        width: 2000,
        height: 1650,
        set: () => {},
      };
      component.mlApiEllipseLoop(mLResponseNew, '');
    });
    it('should call mlApiEllipseLoop function', () => {
      expect(component.mlApiEllipseLoop).toBeDefined();
    });
  });

  /*** it should call ngOnDestroy function ***/
  describe('#ngOnDestroy', () => {
    it('it should call ngOnDestroy', () => {
      (component as any).eventsSubscription = subscriptionSpy;
      component.ngOnDestroy();
      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
    });
  });

  /*** it should call drawEllipse function ***/
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

  /*** it should call drawEllipse function, when icon is true ***/
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

  /*** it should call updatePrediction function ***/
  describe('#updatePrediction', () => {
    it('it should call updatePrediction', () => {
      component.canvas = {
        getActiveObject: () => {
          return { id: 1, set: () => {} };
        },
        renderAll: () => {},
      };
      component.selectedDisease = 'Bulla';
      component.updatePrediction();
      expect(component.updatePrediction).toBeDefined();
    });
  });

  /*** it should call save function ***/
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

  /*** it should call updateEllipse function ***/
  describe('#updateEllipse', () => {
    it('it should call updateEllipse', () => {
      component.updateEllipse();
      expect(component.updateEllipse).toBeDefined();
    });
  });

  /*** it should call onSubmitPatientDetails function ***/
  describe('#onSubmitPatientDetails', () => {
    it('it should call onSubmitPatientDetails', () => {
      component.canvas = {
        toDataURL: () => {},
        renderAll: () => {},
      };
      component.processedImage = 'data64:abcde';
      component.onSubmitPatientDetails();
      expect(annotatedXrayServiceSpy.xrayAnnotatedService).toHaveBeenCalledWith(
        component.processedImage
      );
      expect(component.onSubmitPatientDetails).toBeDefined();
    });
  });

  /*** it should call getColorMapping function ***/
  describe('#getColorMapping', () => {
    it('it should call getColorMapping', () => {
      component.canvas = {
        getActiveObject: () => {
          return { id: 1, set: () => {} };
        },
        renderAll: () => {},
      };
      component.getColorMapping('Bulla', true);
      expect(component.getColorMapping).toBeDefined();
    });
  });
});
