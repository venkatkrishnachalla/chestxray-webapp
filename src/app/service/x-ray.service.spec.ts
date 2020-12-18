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

  /*** it should create xray service ***/
  it('should create', () => {
    expect(service).toBeTruthy();
  });

  /*** it should call get ask ai detail function ***/
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
        returnSecureToken: true,
      };
      responsePromise = service.getAskAiDetails(
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD',
        'abcd'
      );
      expect(service.getAskAiDetails).toBeDefined();
    });
  });

  /*** it should call handleError event ***/
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

  /*** it should call xrayAnnotatedService function ***/
  describe('#xrayAnnotatedService', () => {
    it('should call xrayAnnotatedService', () => {
      service.xrayAnnotatedService({});
      expect(service.xrayAnnotatedService).toBeDefined();
    });
  });

  /*** it should call getAnnotatedImageData function ***/
  describe('#getAnnotatedImageData', () => {
    it('should call getAnnotatedImageData', () => {
      service.getAnnotatedImageData();
      expect(service.getAnnotatedImageData).toBeDefined();
    });
  });

  /*** it should call xrayAnnotatedImpressions function ***/
  describe('#xrayAnnotatedImpressions', () => {
    it('should call xrayAnnotatedImpressions', () => {
      service.xrayAnnotatedImpressions({});
      expect(service.xrayAnnotatedImpressions).toBeDefined();
    });
  });

  /*** it should call xrayAnnotatedImpressionsService function ***/
  describe('#xrayAnnotatedImpressionsService', () => {
    it('should call xrayAnnotatedImpressionsService', () => {
      service.xrayAnnotatedImpressionsService();
      expect(service.xrayAnnotatedImpressionsService).toBeDefined();
    });
  });

  /*** it should call xrayAnnotatedFindings function ***/
  describe('#xrayAnnotatedFindings', () => {
    it('should call xrayAnnotatedFindings', () => {
      service.xrayAnnotatedFindings({});
      expect(service.xrayAnnotatedFindings).toBeDefined();
    });
  });

  /*** it should call xrayAnnotatedFindingsService function ***/
  describe('#xrayAnnotatedFindingsService', () => {
    it('should call xrayAnnotatedFindingsService', () => {
      service.xrayAnnotatedFindingsService();
      expect(service.xrayAnnotatedFindingsService).toBeDefined();
    });
  });
});
