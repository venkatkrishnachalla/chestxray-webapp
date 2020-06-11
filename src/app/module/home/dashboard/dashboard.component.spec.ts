import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AgGridModule } from 'ag-grid-angular';

fdescribe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let e1: HTMLElement

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[AgGridModule],
      declarations: [ DashboardComponent ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnIit function', () => {
    const result = component.ngOnInit();
    expect(component.ngOnInit).toBeDefined();
  });
  it('should have expected column headers', () => {
    let tableRows = fixture.nativeElement.querySelectorAll('.ag-header-cell-text');
    expect(tableRows.length).toBe(7);
    expect(tableRows[0].innerHTML).toBe('Patient Id');
    expect(tableRows[1].innerHTML).toBe('Patient Name');
    expect(tableRows[2].innerHTML).toBe('Gender');
    expect(tableRows[3].innerHTML).toBe('Age');
    expect(tableRows[4].innerHTML).toBe('Priority');
    expect(tableRows[5].innerHTML).toBe('Ref. Doctor');
    expect(tableRows[6].innerHTML).toBe('Action');
  });
  it('search should filter patient list', () => {
    let e1 = fixture.nativeElement.querySelectorAll('.search-patient');
    e1[0].value = "Patient1";
    fixture.componentInstance.searchValue = 'Patient1';
    fixture.detectChanges();
    let tableRows = fixture.nativeElement.querySelectorAll('.ag-row.ag-row-no-focus.ag-row-odd.ag-row-level-0.ag-row-position-absolute');
    expect(tableRows.length).toBe(3);
  });

});
