import { ApiEndPointService } from './api-end-point.service';

describe('ApiEndPointService', () => {
  let apiEndPointService: ApiEndPointService;

  beforeEach(() => {
    apiEndPointService = new ApiEndPointService();
  });

  it('should create', () => {
    expect(apiEndPointService).toBeTruthy();
  });

  describe('#getUrl', () => {
    beforeEach(() => {});
    it('should call getUrl function', () => {
      (apiEndPointService as any).getUrl('abcd', ['a', 'b', 'c']);
      expect((apiEndPointService as any).getUrl).toBeDefined();
    });
    it('should call getUrl function,when pathVariables is empty', () => {
      (apiEndPointService as any).getUrl('abcd', []);
      expect((apiEndPointService as any).getUrl).toBeDefined();
    });
  });

  describe('#getHttpQueryParams', () => {
    beforeEach(() => {
      (apiEndPointService as any).getHttpQueryParams('abcd');
    });
    it('should call getHttpQueryParams function', () => {
      expect((apiEndPointService as any).getHttpQueryParams).toBeDefined();
    });
  });

  describe('#getSingInURL', () => {
    it('should call getSingInURL function', () => {
      apiEndPointService.getSingInURL();
      const result = apiEndPointService.getSingInURL();
<<<<<<< HEAD
      expect(result).toEqual(
        'https://chestxrayqa.southindia.cloudapp.azure.com/identity/v1/Account/Login/'
      );
=======
      expect(result).toEqual('http://localhost:3000/auth');
>>>>>>> 48b50345793a62ee1ab289800ce436b51001be95
    });
  });

  describe('#getRefreshToken', () => {
    beforeEach(() => {
      apiEndPointService.getRefreshToken();
    });
    it('should call getRefreshToken function', () => {
      expect(apiEndPointService.getRefreshToken).toBeDefined();
    });
  });

  describe('#getPatientInstanceId', () => {
    beforeEach(() => {
      apiEndPointService.getPatientInstanceId(
        '1ccacea1-6652f70d-a4bfc923-2ee20176-fe1dc596'
      );
    });
    it('should call getRefreshToken function', () => {
      expect(apiEndPointService.getPatientInstanceId).toBeDefined();
    });
  });

  describe('#getPatientImage', () => {
    beforeEach(() => {
      apiEndPointService.getPatientImage(
        '04a15fea-d20caf28-42f81174-117b49f5-84115d93'
      );
    });
    it('should call getRefreshToken function', () => {
      expect(apiEndPointService.getPatientImage).toBeDefined();
    });
  });
});
