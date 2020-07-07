import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalFilesystemComponent } from './local-filesystem.component';

describe('LocalFilesystemComponent', () => {
  let component: LocalFilesystemComponent;
  let fixture: ComponentFixture<LocalFilesystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalFilesystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalFilesystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
