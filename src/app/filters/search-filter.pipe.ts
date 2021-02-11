import { Pipe, PipeTransform } from '@angular/core';
import { EventEmitterService2 } from '../service/event-emitter.service2';

@Pipe({
  name: 'searchFilter',
})
// SearchFilterPipe class implementation
export class SearchFilterPipe implements PipeTransform {
  filteredData:any;

  constructor(private eventEmitterService: EventEmitterService2){

  }
  /**
   * This is a  _filter function.
   * @param '{string}' value - A string param
   * @param '{string}' value - A string param
   * @param '{string}' value - A string param
   * @example
   *  _filter(name, opt, value);
   */

  _filter = (name: string, opt: string[], value: string): string[] => {
    const filterValue = value.toLowerCase();
    if (name.toLowerCase().indexOf(filterValue) !== 0) {
      return opt.filter(
        (item) => item.toLowerCase().indexOf(filterValue) === 0
      );
    } else {
      return opt;
    }
  };

  /**
   * This is a transform function.
   * @param '{any}' array - A any param
   * @param '{string}' value - A string param
   * @example
   * transform(list, filterText);
   */

  transform(list: any[], filterText: string): any {
    if (filterText) {
      filterText = filterText.toLowerCase();
    }
    if (!filterText) {
      return list;
    }
    if (filterText) {
      this.filteredData =  list
        .map((group) => ({
          abnormality: group.abnormality,
          Names: this._filter(group.abnormality, group.Names, filterText),
        }))
        .filter((group) => {
          return (
            group.abnormality.toLowerCase().indexOf(filterText) === 0 ||
            group.Names.length > 0
          );
        });
        if (this.filteredData.length === 0){
          this.eventEmitterService.disablePathologyButtons(true);
        }
        else{
          this.eventEmitterService.disablePathologyButtons(false);
          return this.filteredData;
        }
        // return this.filteredData;
    }
  }
}
