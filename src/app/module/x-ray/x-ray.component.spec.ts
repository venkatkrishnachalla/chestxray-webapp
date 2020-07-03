import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XRayComponent } from './x-ray.component';

describe('XRayComponent', () => {
  // let component: XRayComponent;
  // let fixture: ComponentFixture<XRayComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ XRayComponent ]
  //   })
  //   .compileComponents();
  // }));

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(XRayComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
  let component: XRayComponent;

  beforeEach(() => {
    component = new XRayComponent(
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should call ngOnIit function', () => {
      const result = component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  describe('#openAskAI', () => {
    beforeEach(() => {
      // tslint:disable-next-line: deprecation
      component.openAskAI(event);
    });
    it('should call openAskAI function', () => {
      // tslint:disable-next-line: deprecation
      const result = component.openAskAI(event);
      expect(component.openAskAI).toBeDefined();
    });
  });

  describe('#rejectAI', () => {
    beforeEach(() => {
      // tslint:disable-next-line: deprecation
      component.rejectAI(event);
    });
    it('should call rejectAI function', () => {
      // tslint:disable-next-line: deprecation
      const result = component.rejectAI(event);
      expect(component.rejectAI).toBeDefined();
    });
  });
});
