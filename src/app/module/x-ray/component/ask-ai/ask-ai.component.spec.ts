import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskAiComponent } from './ask-ai.component';

describe('AskAiComponent', () => {
  let component: AskAiComponent;
  let fixture: ComponentFixture<AskAiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskAiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
