import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
//import { AppComponent } from './app.component';
import { MainComponent } from './app/base/main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';


import { SpecialScheduleListComponent } from './base/special-schedule/special-schedule-list/special-schedule-list.component';
import { SpecialScheduleDetailsComponent } from './base/special-schedule/special-schedule-details/special-schedule-details.component';
import { ZoneListComponent } from './base/zone/zone-list/zone-list.component';


@NgModule({
  declarations: [
    //    AppComponent,
    MainComponent,
    SpecialScheduleListComponent,
    SpecialScheduleDetailsComponent,
    ZoneListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule, MatIconModule, MatCardModule, MatButtonModule, MatGridListModule
  ],
  providers: [],
  bootstrap: [MainComponent]
})
export class AppModule { }
