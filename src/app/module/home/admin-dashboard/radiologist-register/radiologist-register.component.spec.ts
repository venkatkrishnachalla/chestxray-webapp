import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologistRegisterComponent } from './radiologist-register.component';

describe('RadiologistRegisterComponent', () => {
  let component: RadiologistRegisterComponent;
  let fixture: ComponentFixture<RadiologistRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologistRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologistRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
