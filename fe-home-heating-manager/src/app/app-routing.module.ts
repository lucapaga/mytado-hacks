import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpecialScheduleListComponent } from './base/special-schedule/special-schedule-list/special-schedule-list.component';
import { SpecialScheduleDetailsComponent } from './base/special-schedule/special-schedule-details/special-schedule-details.component';
import { ZoneListComponent } from './base/zone/zone-list/zone-list.component';

const routes: Routes = [
    { path: "special-schedules", component: SpecialScheduleListComponent },
    { path: "special-schedules/:specialScheduleId", component: SpecialScheduleDetailsComponent },
    { path: "zones", component: ZoneListComponent },
    { path: "", redirectTo: "/special-schedules", pathMatch: "full" }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
