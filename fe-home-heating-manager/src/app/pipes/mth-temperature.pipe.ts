import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mthTemperature'
})
export class MthTemperaturePipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    return (value != null) ? "" + value + "°" : ((args[0] != null) ? args[0] : "--");
  }

}
