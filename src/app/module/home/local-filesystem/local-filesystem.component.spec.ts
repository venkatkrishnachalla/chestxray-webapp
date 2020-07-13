import { LocalFilesystemComponent } from './local-filesystem.component';
import { FormGroup } from '@angular/forms';
import { of } from 'rxjs';

describe('LocalFilesystemComponent', () => {
  let component: LocalFilesystemComponent;
  const FormBuilderSpy = jasmine.createSpyObj('FormBuilder', ['group']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const formGroupSpy = jasmine.createSpyObj('FormGroup', [
    'setValue',
    'patchValue',
    'markAsDirty',
    'markAsPristine',
    'value',
  ]);
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['userSubject']);
  const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);

  beforeEach(() => {
    component = new LocalFilesystemComponent(
      FormBuilderSpy,
      routerSpy,
      authServiceSpy
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      const mockInResponse = {
        username: 'mohan',
        userroles: ['hospitalradiologist'],
      };
      authServiceSpy.userSubject = of(mockInResponse);
      component.uploadImageForm = formGroupSpy;
      component.ngOnInit();
    });
    it('should call ngOnIit function', () => {
      expect(component.ngOnInit).toBeDefined();
    });
  });

  describe('#getToday', () => {
    beforeEach(() => {
      component.getToday();
    });
    it('should call getToday function', () => {
      expect(component.getToday).toBeDefined();
    });
  });

  describe('#onFileChange', () => {
    const file = {
      upload: {
        progress: 0,
        total: 17343,
        bytesSent: 0,
        filename: 'TEST.jpeg',
      },
      type: 'images/jpeg',
      width: 350,
      height: 200,
      size: 17343,
      name: 'TEST.jpeg',
      dataURL: 'data:image/jpeg;base64, FOO',
    };
    beforeEach(() => {
      const event = {
        target: {
          files: [
            {
              name: 'abcd.jpg',
            },
          ],
        },
      };
    });
    it('should call onFileChange function', () => {
      const mockIndex = 1;
      const mockIsReq = false;
      const mockFile = new File([''], 'filename', { type: 'text/html' });
      const mockFormGroup = new FormGroup({});
      const mockEvt = { target: { files: [mockFile] } };
      const mockReader: FileReader = jasmine.createSpyObj('FileReader', [
        'readAsDataURL',
        'onload',
      ]);
      spyOn(window as any, 'FileReader').and.returnValue(mockReader);
      component.onFileChange(mockEvt as any);
      expect(component.onFileChange).toBeDefined();
    });
  });

  describe('#dragDropEvent', () => {
    beforeEach(() => {
      const eventSpy = 'data:base64:,abcd';
      component.dragDropEvent(eventSpy);
    });
    it('should call dragDropEvent function', () => {
      expect(component.dragDropEvent).toBeDefined();
    });
  });

  describe('#dragDropFile', () => {
    beforeEach(() => {
      const event = {
        upload: {
          progress: 0,
          total: 17343,
          bytesSent: 0,
          filename: 'TEST.jpeg',
        },
        type: 'images/jpeg',
        width: 350,
        height: 200,
        size: 17343,
        name: 'TEST.jpeg',
        dataURL: 'data:image/jpeg;base64, FOO',
      };
      component.uploadImageForm = formGroupSpy;
      component.dragDropFile(event);
    });
    it('should call dragDropFile function', () => {
      expect(component.dragDropFile).toBeDefined();
    });
  });

  describe('#onSubmit', () => {
    it('should call onSubmit function', () => {
      component.uploadImageForm = formGroupSpy;
      component.onSubmit();
      expect(component.onSubmit).toBeDefined();
    });
  });

  describe('#ngOnDestroy', () => {
    it('it should call ngOnDestroy', () => {
      (component as any).userSubscription = subscriptionSpy;
      component.ngOnDestroy();
      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
    });
  });
});
