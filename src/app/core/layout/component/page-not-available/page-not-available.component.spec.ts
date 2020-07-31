import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotAvailableComponent } from './page-not-available.component';

describe('PageNotAvailableComponent', () => {
  let component: PageNotAvailableComponent;
  let fixture: ComponentFixture<PageNotAvailableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageNotAvailableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
