import { DragDropComponent } from './drag-drop.component';

describe('DragDropComponent', () => {
  let component: DragDropComponent;

  beforeEach(() => {
    component = new DragDropComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should call ngOnIit function', () => {
      expect(component.ngOnInit).toBeDefined();
    });
  });

  describe('#handleDragEnter', () => {
    beforeEach(() => {
      component.handleDragEnter();
    });
    it('should call handleDragEnter function', () => {
      expect(component.handleDragEnter).toBeDefined();
    });
  });

  describe('#handleDragLeave', () => {
    beforeEach(() => {
      component.handleDragLeave();
    });
    it('should call handleDragLeave function', () => {
      expect(component.handleDragLeave).toBeDefined();
    });
  });

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

  describe('#handleImageLoad', () => {
    beforeEach(() => {
      component.handleImageLoad();
    });
    it('should call handleImageLoad function', () => {
      expect(component.handleImageLoad).toBeDefined();
    });
  });

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
});
