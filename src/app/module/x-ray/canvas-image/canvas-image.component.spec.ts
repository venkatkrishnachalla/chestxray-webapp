import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasImageComponent } from './canvas-image.component';

xdescribe('CanvasImageComponent', () => {
  let component: CanvasImageComponent;
  let fixture: ComponentFixture<CanvasImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CanvasImageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
