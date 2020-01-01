import { Component, OnInit } from '@angular/core';
import { SpecialSchedule } from 'src/app/entities/special-schedule/special-schedule';
import { SpecialScheduleManagerService } from 'src/app/scvs/special-schedule-manager.service';

@Component({
  selector: 'app-special-schedule-list',
  templateUrl: './special-schedule-list.component.html',
  styleUrls: ['./special-schedule-list.component.css']
})
export class SpecialScheduleListComponent implements OnInit {

  private mockedListOfSchedules: SpecialSchedule[] = [
      new SpecialSchedule("ID1", "Primo", false),
      new SpecialSchedule("ID2", "Secondo", false),
      new SpecialSchedule("ID3", "Terzo", true)
    ];

  public listOfSpecialSchedules: SpecialSchedule[] = null;

  constructor(private specialScheduleManagerService: SpecialScheduleManagerService) { }

  ngOnInit() {
    //this.listOfSpecialSchedules = this.mockedListOfSchedules;
    this.specialScheduleManagerService.listSpecialSchedulesFor(422292).subscribe(
      (data: SpecialSchedule[]) => {
        this.listOfSpecialSchedules = data;
      },
      error => {}
    );
  }

  activateSchedule(specialSchedule: SpecialSchedule) {
    console.log("Activating Special Schedule: ", specialSchedule);
  }

  deactivateSchedule(specialSchedule: SpecialSchedule) {
    console.log("DEactivating Special Schedule: ", specialSchedule);    
  }

  deleteSchedule(specialSchedule: SpecialSchedule) {
    console.log("Deleting Special Schedule: ", specialSchedule);
  }

}
