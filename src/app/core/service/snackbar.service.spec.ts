import { SnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
  let snackbarService: SnackbarService;
  const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

  beforeEach(() => {
    snackbarService = new SnackbarService(snackBarSpy);
  });

  it('should create', () => {
    expect(snackbarService).toBeTruthy();
  });

  describe('#open', () => {
    beforeEach(() => {
      snackbarService.horizontalPosition = 'center';
      snackbarService.verticalPosition = 'top';
      snackbarService.open('Operation Successful', 'SUCCESS');
    });
    it('should call open function', () => {
      const mockObject = {
        panelClass: 'error-snackbar',
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      };
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Operation Successful',
        'X',
        mockObject
      );
    });
  });
});
