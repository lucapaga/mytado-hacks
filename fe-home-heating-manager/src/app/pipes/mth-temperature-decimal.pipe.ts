import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mthTemperatureDecimal'
})
export class MthTemperatureDecimalPipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    return (value != null) ? "'" + Math.floor((value - Math.floor(value))*10) : ((args[0] != null) ? args[0] : "--");
  }

}
