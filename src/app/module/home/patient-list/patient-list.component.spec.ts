import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientListComponent } from './patient-list.component';

fdescribe('PatientListComponent', () => {
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
      dashboardServiceSpy
    );
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
    it('should call ngOnInit function', () => {});
  });

  describe('#getPatientList', () => {
    beforeEach(() => {
      component.getPatientList();
    });
    it('should call getPatientList function', () => {});
  });

  describe('#onGridReady', () => {
    beforeEach(() => {
      component.onGridReady('abcd');
    });
    it('should call onGridReady function', () => {});
  });

  describe('#autoSizeAll', () => {
    beforeEach(() => {
      component.autoSizeAll(true);
    });
    it('should call autoSizeAll function', () => {});
  });
});
