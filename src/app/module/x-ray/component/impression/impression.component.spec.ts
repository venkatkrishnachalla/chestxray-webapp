import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpressionComponent } from './impression.component';

describe('ImpressionComponent', () => {
  let component: ImpressionComponent;
  let fixture: ComponentFixture<ImpressionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImpressionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getImpressions function', () => {
    const result = component.getImpressions();
    expect(component.getImpressions).toBeDefined();
  });
  it('should call deleteImpression function', () => {
    const result = component.deleteImpression(2);
    expect(component.deleteImpression).toBeDefined();
  });
  it('should call updateImpression function', () => {
    const result = component.updateImpression('');
    expect(component.updateImpression).toBeDefined();
  });
});
