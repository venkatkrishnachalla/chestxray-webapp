import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalRadiologistComponent } from './hospital-radiologist.component';

describe('HospitalRadiologistComponent', () => {
  let component: HospitalRadiologistComponent;
  let fixture: ComponentFixture<HospitalRadiologistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalRadiologistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalRadiologistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
