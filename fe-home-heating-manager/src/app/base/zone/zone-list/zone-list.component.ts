import { Component, OnInit } from '@angular/core';
import { Zone } from 'src/app/entities/zone';
import { ZoneManagerService } from 'src/app/scvs/zone-manager.service';

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

  constructor(private zoneManagerService: ZoneManagerService) { }

  ngOnInit() {
    //this.zoneList = this.mockedZoneList;
    this.zoneManagerService.listZones(422292).subscribe(
      (data: Zone[]) => {
        this.zoneList = [];
        data.forEach(aZone => {
          this.zoneManagerService.getZoneTelemetricsAndConfiguration(422292, aZone).subscribe((data: Zone) => {
            this.zoneList.push(data);
          });
        });
      }
    );
  }

  isTargetTempAReferenceValue(zone: Zone) {
    if(!this.isOverlayTempAReferenceValue(zone) && !this.isNextChangeTempAReferenceValue(zone)) {
      if(zone != null && zone.configuration != null && zone.configuration.targetTemperature != null && zone.configuration.targetTemperature > 0) {
        return true;
      }
    }
    return false;
  }
  isNextChangeTempAReferenceValue(zone: Zone) {
    if(!this.isOverlayTempAReferenceValue(zone)) {
      if(zone != null && zone.configuration != null && zone.configuration.nextChangeTemperature != null && zone.configuration.nextChangeTemperature > 0) {
        return true;
      }
      }
    return false;
  }
  isOverlayTempAReferenceValue(zone: Zone) {
    if(zone != null && zone.configuration != null && zone.configuration.overlayActive && zone.configuration.overlayTemperature != null && zone.configuration.overlayTemperature > 0) {
      return true;
    }
    return false;
  }

}
