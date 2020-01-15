import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mthTemperatureDecimals'
})
export class MthTemperatureDecimalsPipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    return (value != null) ? "'" + Math.floor((value - Math.floor(value))*100) : ((args[0] != null) ? args[0] : "--");
  }

}
