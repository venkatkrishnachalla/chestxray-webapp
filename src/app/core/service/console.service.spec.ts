import { ConsoleService } from './console.service';
import { environment } from 'src/environments/environment';

describe('ConsoleService', () => {
  let consoleService: ConsoleService;

  beforeEach(() => {
    consoleService = new ConsoleService();
  });
/*** it should create service ***/
  it('should create', () => {
    expect(consoleService).toBeTruthy();
  });

        /*** it should info function ***/
  describe('#info', () => {
    beforeEach(() => {
      consoleService.info('dislay');
    });
    it('should call info function', () => {
      expect(consoleService.info).toBeDefined();
    });
  });

        /*** it should log function ***/
  describe('#log', () => {
    beforeEach(() => {
      consoleService.log('log');
    });
    it('should call initialize function', () => {
      expect(consoleService.log).toBeDefined();
    });
  });

      /*** it should warn function ***/
  describe('#warn', () => {
    it('should call warn function', () => {
      consoleService.warn('display');
      expect(consoleService.warn).toBeDefined();
    });
  });

    /*** it should error function ***/
  describe('#error', () => {
    it('should call error function', () => {
      consoleService.error('display');
      expect(consoleService.error).toBeDefined();
    });
  });
});
