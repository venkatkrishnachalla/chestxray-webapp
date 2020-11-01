import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface IConsoleService {
  info(value: any, ...rest: any): void;
  log(value: any, ...rest: any): void;
  warn(value: any, ...rest: any): void;
  error(value: any, ...rest: any): void;
}
@Injectable({
  providedIn: 'root',
})
// ConsoleService class implementation
export class ConsoleService {
  /*
   * constructor for ConsoleService class
   */

  constructor() {}

  /**
   * This is a info function.
   *  @param '{any}' data - A array param
   * @param '{any}' data - A array param
   * @example
   * info(value, rest);
   */

  info(value: any, ...rest: any): void {
    if (!environment.production) {
      // tslint:disable-next-line:no-console
      console.info(value, ...rest);
    }
  }

  /**
   * This is a log function.
   *  @param '{any}' data - A array param
   * @param '{any}' data - A array param
   * @example
   * log(value, rest);
   */

  log(value: any, ...rest: any): void {
    if (!environment.production) {
      // tslint:disable-next-line:no-console
      console.log(value, ...rest);
    }
  }

  /**
   * This is a warn function.
   *  @param '{any}' data - A array param
   * @param '{any}' data - A array param
   * @example
   * warn(value, rest);
   */

  warn(value: any, ...rest: any): void {
    if (!environment.production) {
      // tslint:disable-next-line:no-console
      console.warn(value, ...rest);
    }
  }

  /**
   * This is a error function.
   *  @param '{any}' data - A array param
   * @param '{any}' data - A array param
   * @example
   * error(value, rest);
   */

  error(value: any, ...rest: any): void {
    if (!environment.production) {
      // tslint:disable-next-line:no-console
      console.error(value, ...rest);
    }
  }
}
