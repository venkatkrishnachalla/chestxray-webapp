import { XRayService } from './x-ray.service';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

describe('XRayService', () => {
  let service: XRayService;
  const mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const endpointSpy = jasmine.createSpyObj('ApiEndPointService', [
    'getSingInURL',
    'getRefreshToken',
    'getAskAi',
  ]);

  beforeEach(() => {
    service = new XRayService(mockHttpClient, endpointSpy);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('#getAskAiDetails', () => {
    let responsePromise;
    beforeEach(() => {
      const response = new HttpResponse({ status: 204 });
      endpointSpy.getAskAi.and.returnValue('/api/v1.0/predictions');
      mockHttpClient.post.and.returnValue(of(response));
    });
    it('should call http post on ask api click', () => {
      const signInMock = {
        doctorName: 'test',
        password: '123456',
        returnSecureToken: true
      };
      responsePromise = service.getAskAiDetails(
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD', 'abcd'
      );
      expect(service.getAskAiDetails).toBeDefined();
    });
  });

  describe('#handleError', () => {
    beforeEach(() => {
      const mock = {
        error: {
          error: { message: 'not found' },
        },
      };
      (service as any).handleError(mock);
    });
    it('should call getPatientInstanceId', () => {
      expect((service as any).handleError).toBeDefined();
    });
  });
});
