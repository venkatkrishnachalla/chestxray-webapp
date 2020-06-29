import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientListComponent } from './patient-list.component';
import { throwError } from 'rxjs';
import {HttpClientModule} from '@angular/common/http';
import {HttpTestingController} from '@angular/common/http/testing';
import { DashboardService } from 'src/app/service/dashboard.service';

describe('PatientListComponent', () => {
  let component: PatientListComponent;
  const httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
  const elementRefSpy = jasmine.createSpyObj('ElementRef', ['nativeElement']);
  const dashboardServiceSpy = jasmine.createSpyObj('DashboardService', [
    'getPatientList',
  ]);
  let fixture: ComponentFixture<PatientListComponent>;

  beforeEach(() => {
    component = new PatientListComponent(
      httpSpy,
      elementRefSpy,
      dashboardServiceSpy,
    );
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [PatientListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should call ngOnInit function', () => {
      const result = component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  describe('#getPatientList', () => {
    let service: DashboardService;
    let httpMock: HttpTestingController;
    beforeEach(() => {
      service = TestBed.get(DashboardService);
      httpMock = TestBed.get(HttpTestingController);
    });
    it('should call getPatientList function', () => {
      const samplePatient = [{ patientId:12,name:"Krishna",
                                gender:"M",age:56,priority:"Minor",
                                referenceDoctor:"Corkery, Charley DDS",
                                date:"Tue Aug 20 2019 17:49:53 GMT+0530 (India Standard Time)",
                                desc:"Testing",status:"in-process",
                                instanceID:"4df09ebb-adb7-4d81-a7e0-7d108ceb8f08"}]
      dashboardServiceSpy.getPatientList()
        .subscribe((patientResponse: any) => {
          expect(patientResponse[0].patientId).toBe(12);
          expect(patientResponse).toEqual(samplePatient);
        });
    });
  });

  describe('#onGridReady', () => {
    beforeEach(() => {
      component.onGridReady({});
    });
    it('should call onGridReady function', () => {
      const result = component.onGridReady({});
      expect(component.onGridReady).toBeDefined();
    });
  });

  describe('#autoSizeAll', () => {
    beforeEach(() => {
      component.autoSizeAll(true);
    });
    it('should call autoSizeAll function', () => {
      const result = component.autoSizeAll(true);
      expect(component.autoSizeAll).toBeDefined();
    });
  });
});
