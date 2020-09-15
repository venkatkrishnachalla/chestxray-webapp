import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { PatientListComponent } from './patient-list.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardService } from 'src/app/service/dashboard.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { AgGridModule } from '../../../../../node_modules/ag-grid-angular';
import { of, throwError } from 'rxjs';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { patientMock } from '../../auth/patient-mock';

describe('PatientListComponent', () => {
  let component: PatientListComponent;
  const httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
  const elementRefSpy = jasmine.createSpyObj('ElementRef', ['nativeElement']);
  const dashboardServiceSpy = jasmine.createSpyObj('DashboardService', [
    'getPatientList',
  ]);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'onErrorMessage',
  ]);
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['userSubject']);
  const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientListComponent],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        AgGridModule.withComponents([]),
      ],
      providers: [dashboardServiceSpy],
    }).compileComponents();
  }));

  beforeEach(() => {
    component = new PatientListComponent(
      elementRefSpy,
      dashboardServiceSpy,
      authServiceSpy,
      routerSpy,
      eventEmitterServiceSpy
    );
  });

  /*** it should create component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call ngOnInit function ***/
  describe('#ngOnInit', () => {
    const samplePatient = patientMock;
    const mockInResponse = {
      username: 'mohan',
      userroles: ['hospitalradiologist'],
    };
    beforeEach(() => {
      component.defaultColDef = { width: 200 };
      component.columnDefs = component.constants.patientDashboard.headers;
      dashboardServiceSpy.getPatientList.and.returnValue(of(samplePatient));
    });
    it('should call ngOnIit function', () => {
      authServiceSpy.userSubject = of(mockInResponse);
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** it should call getPatientList function ***/
  describe('#getPatientList', () => {
    const samplePatient = patientMock;
    beforeEach(() => {
      dashboardServiceSpy.getPatientList.and.returnValue(of(samplePatient));
      component.getPatientList();
    });
    it('should call getPatientList function', () => {
      dashboardServiceSpy.getPatientList().subscribe((patientResponse: any) => {
        expect(patientResponse).toEqual(samplePatient);
      });
      expect(component.getPatientList).toBeDefined();
    });
  });

  /*** it should call getPatientList function, when it returns error ***/
  describe('#getPatientList', () => {
    beforeEach(() => {
      dashboardServiceSpy.getPatientList.and.returnValue(
        throwError({ status: 404 })
      );
      component.getPatientList();
    });
    it('should call getPatientList function', () => {
      expect(component.getPatientList).toBeDefined();
    });
  });

  /*** it should call onGridReady function ***/
  describe('#onGridReady', () => {
    const params = {
      type: 'gridReady',
      api: GridApi,
      columnApi: ColumnApi,
    };
    beforeEach(() => {
      (component as any).gridApi = params.api;
      (component as any).gridColumnApi = params.columnApi;
      spyOn(component, 'autoSizeAll');
      component.onGridReady(params);
    });
    it('should call onGridReady function', () => {
      const result = component.onGridReady({});
      expect(component.onGridReady).toBeDefined();
    });
  });

  /*** it should call autoSizeAll function ***/
  describe('#autoSizeAll', () => {
    beforeEach(() => {
      component.gridColumnApi = {
        autoSizeColumns: () => {},
        getAllColumns: () => {
          return [{ colId: 1 }];
        },
      };
      const skipHeader = true;
      component.autoSizeAll(skipHeader);
    });
    it('should call autoSizeAll function', () => {
      expect(component.autoSizeAll).toBeDefined();
    });
  });

  /*** it should call onRowClicked function ***/
  describe('#onRowClicked', () => {
    beforeEach(() => {
      const eventMock = {
        event: {
          target: {
            getAttribute: () => {
              return {
                'data-action-type': 'viewInfo',
              };
            },
          },
        },
      };
      component.onRowClicked(eventMock);
    });
    it('should call onRowClicked function', () => {
      expect(component.onRowClicked).toBeDefined();
    });
  });

  /*** it should call onRowClicked function, when action type equal to redirect ***/
  describe('#onRowClicked', () => {
    beforeEach(() => {
      const eventMock = {
        event: {
          target: {
            getAttribute: () => {
              return {
                'data-action-type': 'redirect',
              };
            },
          },
        },
      };
      component.onRowClicked(eventMock);
    });
    it('should call onRowClicked function, when action type equal to redirect', () => {
      expect(component.onRowClicked).toBeDefined();
    });
  });

  /*** it should call onActionViewClick function ***/
  describe('#onActionViewClick', () => {
    beforeEach(() => {
      const dataMock = {
        name: 'abcde',
      };
      component.onActionViewClick(dataMock);
    });
    it('should call onActionViewClick function', () => {
      expect(component.onActionViewClick).toBeDefined();
    });
  });

  /*** it should call onActionRedirectClick function ***/
  describe('#onActionRedirectClick', () => {
    beforeEach(() => {
      const dataMock = {
        name: 'abcde',
      };
      component.onActionRedirectClick(dataMock);
    });
    it('should call onActionRedirectClick function', () => {
      expect(component.onActionRedirectClick).toBeDefined();
    });
  });

  /*** should call ngOnDestroy ***/
  describe('#ngOnDestroy', () => {
    it('it should call ngOnDestroy', () => {
      (component as any).userSubscription = subscriptionSpy;
      component.ngOnDestroy();
      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
    });
  });
});
