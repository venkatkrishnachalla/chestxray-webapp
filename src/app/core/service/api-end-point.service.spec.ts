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
      expect(result).toEqual(
        'https://chestxrayqa.southindia.cloudapp.azure.com/identity/v1/Account/Login/'
      );
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
});
