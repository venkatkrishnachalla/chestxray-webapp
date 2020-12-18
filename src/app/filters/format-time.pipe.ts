import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
})

// FormatTimePipe class implementation
export class FormatTimePipe implements PipeTransform {
  /**
   * This is a transform function.
   * @param '{number}' index - A number param
   * @example
   * transform(value);
   */

  transform(value: number): string {
    const hours: number = Math.floor(value / 3600);
    const minutes: number = Math.floor((value % 3600) / 60);
    return (
      ('00' + hours).slice(-2) +
      ':' +
      ('00' + minutes).slice(-2) +
      ':' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
  }
}
