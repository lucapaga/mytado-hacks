import { Component, OnInit } from '@angular/core';
import { Zone } from 'src/app/entities/zone';

@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.css']
})
export class ZoneListComponent implements OnInit {
  private mockedZoneList: Zone[] =[
    new Zone(12, "CICCIO"),
    new Zone(22, "CUCCO")
  ];
  
  public zoneList: Zone[];

  constructor() { }

  ngOnInit() {
    this.zoneList = this.mockedZoneList;
  }

}
