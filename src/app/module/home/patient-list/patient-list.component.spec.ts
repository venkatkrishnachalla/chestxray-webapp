import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { PatientListComponent } from './patient-list.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardService } from 'src/app/service/dashboard.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { AgGridModule } from '../../../../../node_modules/ag-grid-angular';
import { of, throwError } from 'rxjs';
import { GridApi, ColumnApi } from 'ag-grid-community';

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
      httpSpy,
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
    const samplePatient = [
      {
        patientId: 12,
        name: 'Krishna',
        gender: 'M',
        age: 56,
        priority: 'Minor',
        referenceDoctor: 'Corkery, Charley DDS',
        date: 'Tue Aug 20 2019 17:49:53 GMT+0530 (India Standard Time)',
        desc: 'Testing',
        status: 'in-process',
        instanceID: '4df09ebb-adb7-4d81-a7e0-7d108ceb8f08',
      },
    ];
    beforeEach(() => {
      component.defaultColDef = { width: 200 };
      component.columnDefs = component.constants.patientDashboard.headers;
      dashboardServiceSpy.getPatientList.and.returnValue(of(samplePatient));
      component.ngOnInit();
    });
    it('should call ngOnIit function', () => {
      const result = component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** it should call getPatientList function ***/
  describe('#getPatientList', () => {
    const samplePatient = [
      {
        patientId: 12,
        name: 'Krishna',
        gender: 'M',
        age: 56,
        priority: 'Minor',
        referenceDoctor: 'Corkery, Charley DDS',
        date: 'Tue Aug 20 2019 17:49:53 GMT+0530 (India Standard Time)',
        desc: 'Testing',
        status: 'in-process',
        instanceID: '4df09ebb-adb7-4d81-a7e0-7d108ceb8f08',
      },
    ];
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
});
