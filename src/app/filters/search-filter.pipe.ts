import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  
  _filter = (opt: string[], value: string): string[] => {
    const filterValue = value.toLowerCase();
    return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
  }; 
  transform(list: any[], filterText: string): any {
    // return list ? list.filter(item => item.names.search(new RegExp(filterText, 'i')) > -1) : [];
    if(filterText)
    filterText = filterText.toLowerCase();
    if (!filterText) return list;
    if (filterText) {
      return list
        .map((group) => ({
          letter: group.letter,
          names: this._filter(group.names, filterText),
        }))
        .filter((group) => {
          return (
            group.letter.toLowerCase().indexOf(filterText) === 0 ||
            group.names.length > 0
          );
        });
    }
  } 

}
