import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mthPercentageUnits'
})
export class MthPercentageUnitsPipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    return (value != null) ? "" + Math.floor(value) + "%" : ((args[0] != null) ? args[0] : "--");
  }

}
