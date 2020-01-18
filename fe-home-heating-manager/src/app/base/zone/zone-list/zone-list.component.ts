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

  showEitherBatteryOrWindowOpenIcon(zone: Zone): string {
    if(zone != null && zone.configuration != null && zone.telemetrics != null) {
      if(zone.batteryState != null && zone.batteryState != "NORMAL") {
        return "BATTERY";
      } else {
        if(zone.telemetrics != null && zone.telemetrics.windowOpen != null && zone.telemetrics.windowOpen) {
          return "WINDOW";
        } else {
          return "BOTH";
        }
      }
    } else {
      return "NONE";
    }
  }

  showBatteryFullIcon(zone: Zone): boolean {
    return (
      (this.showEitherBatteryOrWindowOpenIcon(zone) === 'BATTERY' || this.showEitherBatteryOrWindowOpenIcon(zone) === 'BATTERY') 
      && zone.batteryState === 'NORMAL'
    );
  }
  showBatteryWarningIcon(zone: Zone): boolean {
    return (
      (this.showEitherBatteryOrWindowOpenIcon(zone) === 'BATTERY' || this.showEitherBatteryOrWindowOpenIcon(zone) === 'BOTH') 
      && zone.batteryState != 'NORMAL'
    );
  }
  showWindowNotOpenIcon(zone: Zone): boolean {
    return (
      (this.showEitherBatteryOrWindowOpenIcon(zone) === 'WINDOW' || this.showEitherBatteryOrWindowOpenIcon(zone) === 'BOTH') 
      && 
      (zone.telemetrics.windowOpen == null || !zone.telemetrics.windowOpen)
    );
  }
  showWindowOpenIcon(zone: Zone): boolean {
    return (
      (this.showEitherBatteryOrWindowOpenIcon(zone) === 'WINDOW' || this.showEitherBatteryOrWindowOpenIcon(zone) === 'BOTH') 
      && zone.telemetrics.windowOpen != null && zone.telemetrics.windowOpen
    );
  }

  isTargetTempAReferenceValue(zone: Zone) {
    if(!this.isOverlayTempAReferenceValue(zone)) {// && !this.isNextChangeTempAReferenceValue(zone)) {
      //if(zone != null && zone.configuration != null && zone.configuration.targetTemperature != null && zone.configuration.targetTemperature > 0) {
        return true;
      //}
    }
    return false;
  }
  isNextChangeTempAReferenceValue(zone: Zone) {
    /*
    if(!this.isOverlayTempAReferenceValue(zone)) {
      if(zone != null && zone.configuration != null && zone.configuration.nextChangeTemperature != null && zone.configuration.nextChangeTemperature > 0) {
        return true;
      }
    }
    */
    return false;
  }
  isOverlayTempAReferenceValue(zone: Zone) {
    if(zone != null && zone.configuration != null && zone.configuration.overlayPresent) {
      return true;
    }
    return false;
  }

  isOff(zone: Zone) {
    return !(zone != null && zone.configuration != null && zone.configuration.heating);
  }
}
