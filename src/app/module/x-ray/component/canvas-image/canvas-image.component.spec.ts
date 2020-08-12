import { CanvasImageComponent } from './canvas-image.component';
import { of } from 'rxjs';

fdescribe('CanvasImageComponent', () => {
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
  const toastrServiceSpy = jasmine.createSpyObj('ToastrService', [
    'success',
    'clear',
  ]);

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
      component.canvas = {
        clear: () => {},
      };
      component.canvasDynamicHeight = 0;
      component.canvasDynamicWidth = 0;
      component.canvasScaleX = 0;
      component.canvasScaleY = 0;
      spyOn(component, 'setCanvasDimension');
      spyOn(component, 'setCanvasBackground');
      spyOn(component, 'getSessionEllipse');
      spyOn(component, 'getSessionFreeHandDrawing');
      component.onResize();
    });
    it('should call onResize function', () => {
      expect(component.setCanvasDimension).toHaveBeenCalled();
      expect(component.setCanvasBackground).toHaveBeenCalled();
      expect(component.getSessionEllipse).toHaveBeenCalled();
      expect(component.getSessionFreeHandDrawing).toHaveBeenCalled();
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
      component.savedInfo = {
        data: {
          names: [],
          ndarray: [
            {
              Findings: {},
              Impression: [],
              diseases: [],
            },
          ],
        },
        meta: {},
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

  /*** it should call onSelect function with empty item ***/
  describe('#onSelect', () => {
    beforeEach(() => {
      component.pathologyNames = [
        {
          abnormality: 'Anatomical variants',
          Names: [
            'Cervical rib',
            'Azygos fissure',
            'Aortic Arch variants',
            'Thymus',
          ],
        },
      ];
      const eventSpy = {
        target: {
          textContent: 'abcd',
        },
      };
      const itemSpy = [];
      component.onSelect(eventSpy, itemSpy);
    });
    it('should call onSelect function, with empty item ', () => {
      expect(component.onSelect).toBeDefined();
    });
  });

  /*** it should call onSelect function with empty value  ***/
  describe('#onSelect', () => {
    beforeEach(() => {
      component.pathologyNames = [
        {
          abnormality: 'Anatomical variants',
          Names: [
            'Cervical rib',
            'Azygos fissure',
            'Aortic Arch variants',
            'Thymus',
          ],
        },
      ];
      const eventSpy = {
        target: {
          textContent: 'abcd',
        },
      };
      const itemSpy = '';
      component.onSelect(eventSpy, itemSpy);
    });
    it('should call onSelect function, with empty value', () => {
      expect(component.onSelect).toBeDefined();
    });
  });

  /*** it should call savePrediction function ***/
  describe('#savePrediction', () => {
    beforeEach(() => {
      component.canvas = {
        getActiveObject: () => {
          return {
            id: 13,
            set: () => {},
            canvas: {
              freeDrawingBrush: {
                _points: ['M 3654'],
              },
            },
          };
        },
        renderAll: () => {},
        discardActiveObject: () => {},
      };
      component.selectedDisease = 'Bulla';
      component.activeIcon = {
        active: true,
      };
      spyOn(component, 'storeDataInSession');
      spyOn(component, 'getColorMapping');
      spyOn(component, 'clear');
      component.savePrediction();
    });
    it('should call savePrediction function, if selected object is not an ellipse', () => {
      expect(component.savePrediction).toBeDefined();
      expect(component.storeDataInSession).toHaveBeenCalled();
      expect(eventEmitterServiceSpy.onComponentDataShared).toHaveBeenCalled();
      expect(component.getColorMapping).toHaveBeenCalled();
      expect(component.clear).toHaveBeenCalled();
      expect(dialogSpy.closeAll).toHaveBeenCalled();
      expect(toastrServiceSpy.success).toHaveBeenCalled();
    });
  });

  describe('#savePrediction', () => {
    beforeEach(() => {
      component.canvas = {
        getActiveObject: () => {
          return {
            id: 13,
            set: () => {},
            type: 'ellipse',
            canvas: {
              freeDrawingBrush: {
                _points: ['M 3654'],
              },
            },
          };
        },
        renderAll: () => {},
        discardActiveObject: () => {},
      };
      component.selectedDisease = 'Bulla';
      component.activeIcon = {
        active: true,
      };
      spyOn(component, 'storeDataInSession');
      spyOn(component, 'getColorMapping');
      spyOn(component, 'clear');
      component.savePrediction();
    });
    it('should call savePrediction function, if selected object is ellipse', () => {
      expect(component.savePrediction).toBeDefined();
      expect(component.storeDataInSession).toHaveBeenCalled();
      expect(eventEmitterServiceSpy.onComponentDataShared).toHaveBeenCalled();
      expect(component.getColorMapping).toHaveBeenCalled();
      expect(component.clear).toHaveBeenCalled();
      expect(dialogSpy.closeAll).toHaveBeenCalled();
      expect(toastrServiceSpy.success).toHaveBeenCalled();
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
        forEachObject: () => {},
        renderAll: () => {},
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
        forEachObject: () => {},
        renderAll: () => {},
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
      expect(dialogSpy.closeAll).toHaveBeenCalled();
      expect(toastrServiceSpy.clear).toHaveBeenCalled();
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
        forEachObject: () => {},
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
        forEachObject: () => {},
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
          return {
            id: 1,
            canvas: {
              freeDrawingBrush: {
                _points: ['2345'],
              },
            },
            set: () => {},
          };
        },
        _activeObject: {
          path: '/x-ray',
        },
        renderAll: () => {},
        discardActiveObject: () => {},
      };
      component.savedInfo = {
        data: {
          names: [],
          ndarray: [
            {
              Findings: {},
              Impression: [],
              diseases: [],
            },
          ],
        },
        meta: {},
      };
      component.selectedDisease = 'Bulla';
      component.updatePrediction();
      expect(component.updatePrediction).toBeDefined();
    });
  });

  /*** it should call save function ***/
  describe('#save', () => {
    beforeEach(() => {
      component.canvas = {
        isDrawingMode: true,
        getActiveObject: () => {},
      };
      spyOn(component, 'changeSelectableStatus');
      component.save();
    });
    it('it should call save function, if isDrawingMode is true', () => {
      expect(component.save).toBeDefined();
      expect(dialogSpy.open).toHaveBeenCalled();
      expect(component.changeSelectableStatus).toHaveBeenCalledWith(true);
    });
  });

  /*** it should call save function ***/
  describe('#save', () => {
    beforeEach(() => {
      component.canvas = {
        getActiveObject: () => {},
      };
      spyOn(component, 'changeSelectableStatus');
      component.save();
    });
    it('it should call save function, if isDrawingMode is not true', () => {
      expect(component.save).toBeDefined();
      expect(component.changeSelectableStatus).toHaveBeenCalledWith(true);
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
        _activeObject: {
          path: '/x-ray',
        },
        renderAll: () => {},
      };
      component.savedInfo = {
        data: {
          names: [],
          ndarray: [
            {
              Findings: {},
              Impression: [],
              diseases: [],
            },
          ],
        },
        meta: {},
      };
      component.getColorMapping('Bulla', '');
      expect(component.getColorMapping).toBeDefined();
    });
  });
  /*** it should call getSessionEllipse function if ellipse is in session***/
  describe('#getSessionEllipse', () => {
    beforeEach(() => {
      component.canvas = {
        add: () => {},
        renderAll: () => {},
      };
      component.getSessionEllipse();
    });
    it('should call setCanvasBackground function', () => {
      expect(component.getSessionEllipse).toBeDefined();
      expect(dialogSpy.closeAll).toHaveBeenCalled();
    });
  });

  /*** it should call getSessionFreeHandDrawing function if freeHandDrawing is in session***/
  describe('#getSessionFreeHandDrawing', () => {
    beforeEach(() => {
      component.canvas = {
        add: () => {},
        renderAll: () => {},
      };
      component.getSessionFreeHandDrawing();
    });
    it('should call getSessionFreeHandDrawing function', () => {
      expect(component.getSessionFreeHandDrawing).toBeDefined();
      expect(dialogSpy.closeAll).toHaveBeenCalled();
    });
  });

  /*** it should call saveFreeHandDrawingIntoSession function ***/
  describe('#saveFreeHandDrawingIntoSession', () => {
    beforeEach(() => {
      component.selectedObjectPrediction = {
        canvas: {
          freeDrawingBrush: {
            _points: ['12345'],
          },
        },
      };
      component.saveFreeHandDrawingIntoSession();
    });
    it('should call saveFreeHandDrawingIntoSession function', () => {
      expect(component.saveFreeHandDrawingIntoSession).toBeDefined();
    });
  });

  /*** it should call deleteFreeHandDrawingInSession function ***/
  describe('#deleteFreeHandDrawingInSession', () => {
    beforeEach(() => {
      component.canvas = {
        getActiveObject: () => {},
        renderAll: () => {},
        remove: () => {},
        id: 10,
      };
      component.deleteFreeHandDrawingInSession();
    });
    it('should call deleteFreeHandDrawingInSession function', () => {
      expect(component.deleteFreeHandDrawingInSession).toBeDefined();
    });
  });

  /*** it should call deleteEllipseInSession function ***/
  describe('#deleteEllipseInSession', () => {
    beforeEach(() => {
      component.canvas = {
        getActiveObject: () => {
          return { id: 1, set: () => {} };
        },
        remove: () => {},
        renderAll: () => {},
      };
      component.deleteEllipseInSession();
    });
    it('should call deleteEllipseInSession function', () => {
      expect(component.deleteEllipseInSession).toBeDefined();
    });
  });

  /*** it should call updateFreeHandDrawingIntoSession function ***/
  describe('#updateFreeHandDrawingIntoSession', () => {
    beforeEach(() => {
      component.canvas = {
        getActiveObject: () => {
          return {
            id: 1,
            canvas: {
              freeDrawingBrush: {
                _points: ['2345'],
              },
            },
            set: () => {},
          };
        },
        renderAll: () => {},
      };
      component.updateFreeHandDrawingIntoSession();
    });
    it('should call updateFreeHandDrawingIntoSession function', () => {
      expect(component.updateFreeHandDrawingIntoSession).toBeDefined();
    });
  });

  /*** it should call updateEllipseIntoSession function ***/
  describe('#updateEllipseIntoSession', () => {
    beforeEach(() => {
      component.canvas = {
        getActiveObject: () => {
          return { id: 1, set: () => {} };
        },
        renderAll: () => {},
      };
      component.updateEllipseIntoSession();
    });
    it('should call updateEllipseIntoSession function', () => {
      expect(component.updateEllipseIntoSession).toBeDefined();
    });
  });

  /*** it should call saveEllipseIntoSession function ***/
  describe('#saveEllipseIntoSession', () => {
    beforeEach(() => {
      component.canvas = {
        getActiveObject: () => {},
      };
      spyOn(component, 'scaleSaveEllipse');
      component.saveEllipseIntoSession();
    });
    it('should call saveEllipseIntoSession function', () => {
      expect(component.saveEllipseIntoSession).toBeDefined();
      expect(component.scaleSaveEllipse).toHaveBeenCalled();
      expect(dialogSpy.open).toHaveBeenCalled();
    });
  });

  /*** it should call restrictionToBoundaryLimit function ***/
  describe('#restrictionToBoundaryLimit', () => {
    beforeEach(() => {
      const objSpy = {
        currentHeight: 600,
        currentWidth: 600,
        canvas: {
          height: 500,
          width: 500,
        },
        setCoords: () => {},
        getBoundingRect: () => {
          return {
            top: 200,
            left: 200,
          };
        },
      };
      component.restrictionToBoundaryLimit(objSpy);
    });
    it('should call restrictionToBoundaryLimit function, if current Height & Width is greater than canvas height & width', () => {
      expect(component.restrictionToBoundaryLimit).toBeDefined();
    });
  });

  describe('#restrictionToBoundaryLimit', () => {
    beforeEach(() => {
      const objSpy = {
        currentHeight: 400,
        currentWidth: 400,
        canvas: {
          height: 500,
          width: 500,
        },
        setCoords: () => {},
        getBoundingRect: () => {
          return {
            top: 200,
            left: 200,
          };
        },
      };
      component.restrictionToBoundaryLimit(objSpy);
    });
    it('should call restrictionToBoundaryLimit function, if current Height and Width is lesser than canvas height&width', () => {
      expect(component.restrictionToBoundaryLimit).toBeDefined();
    });
  });

  describe('#restrictionToBoundaryLimit', () => {
    beforeEach(() => {
      const objSpy = {
        currentHeight: 400,
        currentWidth: 400,
        canvas: {
          height: 500,
          width: 500,
        },
        setCoords: () => {},
        getBoundingRect: () => {
          return {
            top: -100,
            left: -100,
          };
        },
      };
      component.restrictionToBoundaryLimit(objSpy);
    });
    it('should call restrictionToBoundaryLimit function, if getBoundingRect top and getBoundingRect left is less than 0', () => {
      expect(component.restrictionToBoundaryLimit).toBeDefined();
    });
  });
  describe('#restrictionToBoundaryLimit', () => {
    beforeEach(() => {
      const objSpy = {
        currentHeight: 400,
        currentWidth: 400,
        canvas: {
          height: 100,
          width: 100,
        },
        setCoords: () => {},
        getBoundingRect: () => {
          return {
            top: 100,
            left: 100,
            height: 100,
            width: 100,
          };
        },
      };
      component.restrictionToBoundaryLimit(objSpy);
    });
    it('should call restrictionToBoundaryLimit function', () => {
      expect(component.restrictionToBoundaryLimit).toBeDefined();
    });
  });

  /*** it should call actionIconsModelDispaly function ***/
  describe('#actionIconsModelDispaly', () => {
    beforeEach(() => {
      component.canvas = {
        isDrawingMode: false,
        getActiveObject: () => {
          return {
            top: 60,
          };
        },
      };
      const data = {
        target: {
          calcCoords: () => {
            return {
              mr: {
                x: 30,
                y: 40,
              },
              mt: {
                x: 30,
                y: 40,
              },
            };
          },
        },
      };
      component.enableDrawEllipseMode = false;
      component.actionIconsModelDispaly(data);
    });
    it('should call actionIconsModelDispaly function, with object top less than 70', () => {
      expect(component.actionIconsModelDispaly).toBeDefined();
      expect(dialogSpy.open).toHaveBeenCalled();
    });
  });

  describe('#actionIconsModelDispaly', () => {
    beforeEach(() => {
      component.canvas = {
        getActiveObject: () => {
          return {
            top: 80,
          };
        },
      };
      const data = {
        angle: 20,
        target: {
          calcCoords: () => {
            return {
              mr: {
                x: 30,
                y: 40,
              },
              mt: {
                x: 30,
                y: 40,
              },
            };
          },
        },
      };
      component.actionIconsModelDispaly(data);
    });
    it('should call actionIconsModelDispaly function, when active object top greater than 80', () => {
      expect(component.actionIconsModelDispaly).toBeDefined();
    });
  });

  /*** it should call markactionModelPosition function ***/
  describe('#markactionModelPosition', () => {
    beforeEach(() => {
      component.canvas = {
        getActiveObject: () => {
          return {
            top: 80,
          };
        },
      };
      const data = {
        target: {
          calcCoords: () => {
            return {
              mr: {
                x: 30,
                y: 40,
              },
              mt: {
                x: 30,
                y: 40,
              },
            };
          },
        },
      };
      component.markactionModelPosition(data);
    });
    it('should call markactionModelPosition function', () => {
      expect(component.markactionModelPosition).toBeDefined();
    });
  });

  /*** it should call updateSearchModel function ***/
  describe('#updateSearchModel', () => {
    beforeEach(() => {
      component.updateSearchModel('');
    });
    it('should call updateSearchModel function', () => {
      expect(component.updateSearchModel).toBeDefined();
    });
  });

  /*** it should call changeSelectableStatus function ***/
  describe('#changeSelectableStatus', () => {
    beforeEach(() => {
      const val = true;
      component.canvas = {
        renderAll: () => {},
        forEachObject: (value) => {
          value.selectable = true;
        },
      };
      component.changeSelectableStatus(val);
    });
    it('it should call changeSelectableStatus', () => {
      expect(component.changeSelectableStatus).toBeDefined();
    });
  });
});
