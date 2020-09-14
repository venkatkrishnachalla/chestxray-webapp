import { DragDropComponent } from './drag-drop.component';

describe('DragDropComponent', () => {
  let component: DragDropComponent;

  beforeEach(() => {
    component = new DragDropComponent();
  });

  /*** should create component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** should call ngOnInit method ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should call ngOnIit function', () => {
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** should call handleDragEnter method ***/
  describe('#handleDragEnter', () => {
    beforeEach(() => {
      component.handleDragEnter();
    });
    it('should call handleDragEnter function', () => {
      expect(component.handleDragEnter).toBeDefined();
    });
  });

  /*** should call handleDragLeave method ***/
  describe('#handleDragLeave', () => {
    beforeEach(() => {
      component.handleDragLeave();
    });
    it('should call handleDragLeave function', () => {
      expect(component.handleDragLeave).toBeDefined();
    });
  });

  /*** should call handleDrop method ***/
  describe('#handleDrop', () => {
    beforeEach(() => {
      const event = {
        dataTransfer: {
          files: [
            {
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
            },
          ],
        },
        preventDefault: () => {},
      };
      const mockFile = new File([''], 'filename', { type: 'text/html' });
      const mockReader: FileReader = jasmine.createSpyObj('FileReader', [
        'readAsDataURL',
        'onload',
      ]);
      spyOn(window as any, 'FileReader').and.returnValue(mockReader);
      component.handleDrop(event);
    });
    it('should call handleDrop function', () => {
      expect(component.handleDrop).toBeDefined();
    });
  });

  /*** should call handleImageLoad method ***/
  describe('#handleImageLoad', () => {
    beforeEach(() => {
      component.handleImageLoad();
    });
    it('should call handleImageLoad function', () => {
      expect(component.handleImageLoad).toBeDefined();
    });
  });

  /*** should call handleInputChange method ***/
  describe('#handleInputChange', () => {
    beforeEach(() => {
      const event = {
        dataTransfer: {
          files: [
            {
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
            },
          ],
        },
      };
      const mockFile = new File([''], 'filename', { type: 'text/html' });
      const mockReader: FileReader = jasmine.createSpyObj('FileReader', [
        'readAsDataURL',
        'onload',
      ]);
      spyOn(window as any, 'FileReader').and.returnValue(mockReader);
      component.handleInputChange(event);
    });
    it('should call handleInputChange function', () => {
      expect(component.handleInputChange).toBeDefined();
    });
  });

  /*** should call handleInputChange method, when unknown image format ***/
  describe('#handleInputChange', () => {
    beforeEach(() => {
      const event = {
        dataTransfer: {
          files: [
            {
              upload: {
                progress: 0,
                total: 17343,
                bytesSent: 0,
                filename: 'TEST.pdf',
              },
              type: 'pdf',
              width: 350,
              height: 200,
              size: 17343,
              name: 'TEST.pdf',
              dataURL: 'data:image/pdf;base64, FOO',
            },
          ],
        },
      };
      const mockFile = new File([''], 'filename', { type: 'text/html' });
      const mockReader: FileReader = jasmine.createSpyObj('FileReader', [
        'readAsDataURL',
        'onload',
      ]);
      spyOn(window as any, 'FileReader').and.returnValue(mockReader);
      component.handleInputChange(event);
    });
    it('should call handleInputChange function, when unknown image format', () => {
      expect(component.handleInputChange).toBeDefined();
    });
  });

  /*** should call _handleReaderLoaded method ***/
  describe('#_handleReaderLoaded', () => {
    beforeEach(() => {
      const event = {
        target: {
          file: 'abcd.jpg',
        },
      };
      component._handleReaderLoaded(event);
    });
    it('should call _handleReaderLoaded function', () => {
      expect(component._handleReaderLoaded).toBeDefined();
    });
  });

  /*** should call getLocalImageSrc method ***/
  describe('#getLocalImageSrc', () => {
    beforeEach(() => {
      component.getLocalImageSrc('abcd');
    });
    it('should call getLocalImageSrc function', () => {
      expect(component.imageSrc).toEqual('abcd');
    });
  });
});
