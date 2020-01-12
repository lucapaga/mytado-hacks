import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mthDuration'
})
export class MthDurationPipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    if(value != null && value > 0) {
      var seconds: number = value % 60;
      var minutesLarge: number = Math.floor(value / 60);
      var minutes: number = minutesLarge % 60;
      var hours: number = Math.floor(minutesLarge / 60);

      var formattedValue = "";

      if(hours > 0) {
        formattedValue = formattedValue + hours + "h";
      }

      if(minutes > 0) {
        if(formattedValue != "") {
          formattedValue = formattedValue + " ";
        }
        formattedValue = formattedValue + minutes + "m"; 
      }
      
      if(seconds > 0) {
        if(formattedValue != "") {
          formattedValue = formattedValue + " ";
        }
        formattedValue = formattedValue + seconds + "s"; 
      }

      return formattedValue;
    }

    return "";
  }

}
