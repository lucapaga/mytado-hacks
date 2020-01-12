import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mthPercentage'
})
export class MthPercentagePipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    return (value != null) ? "" + value + "%" : ((args[0] != null) ? args[0] : "--");
  }

}
