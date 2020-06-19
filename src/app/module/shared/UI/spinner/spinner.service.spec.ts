import { SpinnerService } from './spinner.service';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

describe('SpinnerService', () => {
  let service: SpinnerService;

  beforeEach(() => {
    service = new SpinnerService();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('#show', () => {
    beforeEach(() => {
      service.show();
    });
    it('should call show function', () => {
      const subjectMock = new BehaviorSubject<boolean>(true);
      const mockDatePickerService = {
        selectedDate: subjectMock.asObservable(),
      };
      const value = true;
      subjectMock
        .pipe(filter((res) => !!res))
        .subscribe((res) => expect(res).toEqual(value));
      subjectMock.next(true);
    });
  });

  describe('#hide', () => {
    beforeEach(() => {
      service.hide();
    });
    it('should call hide function', () => {
      const subjectMock = new BehaviorSubject<boolean>(false);
      const mockDatePickerService = {
        selectedDate: subjectMock.asObservable(),
      };
      const value = false;
      subjectMock
        .pipe(filter((res) => !!res))
        .subscribe((res) => expect(res).toEqual(value));
      subjectMock.next(false);
    });
  });
});
