import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XRayHeaderComponent } from './x-ray-header.component';

describe('XRayHeaderComponent', () => {
  let component: XRayHeaderComponent;
  let fixture: ComponentFixture<XRayHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [XRayHeaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XRayHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
