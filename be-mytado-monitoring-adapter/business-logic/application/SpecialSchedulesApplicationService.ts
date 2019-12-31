import { ISpecialScheduleRepository, SpecialScheduleRepository } from "../repositories"
import { IMyTadoOverlay, IMyTadoServicesAdapter, MyTadoServicesAdapter } from "../services"
import { ISpecialSchedule } from "../entities/SpecialSchedule"
import { MyTadoServiceAuthorization } from "../services/MyTadoServiceAuthorization";

export class SpecialSchedulesApllicationService {
    private specialScheduleRepository: ISpecialScheduleRepository = new SpecialScheduleRepository();
    private myTadoServiceAdapter: IMyTadoServicesAdapter = new MyTadoServicesAdapter();

    private authToken: MyTadoServiceAuthorization | null = null;

    findSpecialSchedulesForHome(homeId: number): ISpecialSchedule[] {
        return this.specialScheduleRepository.retrieveForHome(homeId);
    }

    findSpecialSchedulesById(homeId: number, specialScheduleId: string): ISpecialSchedule | null {
        var r: ISpecialSchedule | null = this.specialScheduleRepository.retrieveSpecialScheduleByHomeAndId(homeId, specialScheduleId);
        //console.log("SERVICE: ", r);
        return r;
    }

    activateSchedule(schedule: ISpecialSchedule): void {
        schedule.activate();
        //var resOverlay: IMyTadoOverlay = this.myTadoServiceAdapter.addTimedTemperatureOverlayForHomeAndZone(schedule.home.id, "", 10, 1800);
    }

    findAndActivateSchedule(homeId: number, specialScheduleId: string): void {
        var schedule: ISpecialSchedule | null = this.findSpecialSchedulesById(homeId, specialScheduleId);
        if (schedule != null) {
            console.log("Logging in ...");
            var authToken = this.myTadoServiceAdapter.login("", "");
            console.log("Auth: ", authToken);
            console.log("SpecialSchedule(homeId=" + schedule.home.id + ", id=>" + schedule.id + "<) found, ACTIVATING it ...");
            /*
            schedule.settings.forEach(aZoneSetting => {
                if(schedule != null) {
                    this.myTadoServiceAdapter.addTimedTemperatureOverlayForHomeAndZone(schedule.home.id, aZoneSetting.zone.id, aZoneSetting.temperature, aZoneSetting.duration);
                }
            });
            */
            schedule.activate();
        }
    }

    deactivate(schedule: ISpecialSchedule): void {
        schedule.deactivate();
        //var resOverlay: IMyTadoOverlay = this.myTadoServiceAdapter.removeOverlayForHomeAndZone(schedule.home.id, "");
    }

    findAndDeactivateSchedule(homeId: number, specialScheduleId: string): void {
        var schedule: ISpecialSchedule | null = this.findSpecialSchedulesById(homeId, specialScheduleId);
        if (schedule != null) {
            console.log("SpecialSchedule(homeId=" + schedule.home.id + ", id=>" + schedule.id + "<) found, DEactivating it ...");
            schedule.deactivate();
            //var resOverlay: IMyTadoOverlay = this.myTadoServiceAdapter.addTimedTemperatureOverlayForHomeAndZone(schedule.home.id, "", 10, 1800);
        }
    }

}