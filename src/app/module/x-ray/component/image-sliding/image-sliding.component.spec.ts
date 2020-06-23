import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSlidingComponent } from './image-sliding.component';

describe('ImageSlidingComponent', () => {
  let component: ImageSlidingComponent;
  let fixture: ComponentFixture<ImageSlidingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImageSlidingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSlidingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
