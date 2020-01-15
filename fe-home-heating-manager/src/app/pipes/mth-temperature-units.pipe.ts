import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mthTemperatureUnits'
})
export class MthTemperatureUnitsPipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    return (value != null) ? "" + Math.round(value) : ((args[0] != null) ? args[0] : "--");
  }

}
