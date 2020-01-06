import { ISpecialScheduleRepository, SpecialScheduleRepository } from "../repositories"
import { IMyTadoOverlay, IMyTadoServicesAdapter, MyTadoServicesAdapter } from "mytado-hacks-be-commons"
import { ISpecialSchedule } from "../entities/SpecialSchedule"
import { MyTadoServiceAuthorization } from "mytado-hacks-be-commons";

export class SpecialSchedulesApllicationService {
    private specialScheduleRepository: ISpecialScheduleRepository = new SpecialScheduleRepository();
    private myTadoServiceAdapter: IMyTadoServicesAdapter = new MyTadoServicesAdapter();

    private authToken: MyTadoServiceAuthorization | null = null;


    findSpecialSchedulesForHome(homeId: number): ISpecialSchedule[] {
        return this.specialScheduleRepository.retrieveForHome(homeId);
    }

    findSpecialSchedulesById(homeId: number, specialScheduleId: string): ISpecialSchedule | null {
        var r: ISpecialSchedule | null = this.specialScheduleRepository.retrieveSpecialScheduleByHomeAndId(homeId, specialScheduleId);
        return r;
    }

    activateSchedule(schedule: ISpecialSchedule): void {
        schedule.activate();
        //var resOverlay: IMyTadoOverlay = this.myTadoServiceAdapter.addTimedTemperatureOverlayForHomeAndZone(schedule.home.id, "", 10, 1800);
    }

    async findAndActivateSchedule(homeId: number, specialScheduleId: string) {
        var schedule: ISpecialSchedule | null = this.findSpecialSchedulesById(homeId, specialScheduleId);
        if (schedule != null) {
            var authToken: MyTadoServiceAuthorization = await this.myTadoServiceAdapter.login();
            console.log("Auth: ", authToken);

            console.log("SpecialSchedule(homeId=" + schedule.home.id + ", id=>" + schedule.id + "<) found, ACTIVATING it ...");

            var promises : Promise<IMyTadoOverlay>[] = [];
            schedule.settings.forEach(aZoneSetting => {
                if(schedule != null) {
                    promises.push(
                        this.myTadoServiceAdapter.addTimedTemperatureOverlayForHomeAndZone(
                                                        schedule.home.id, 
                                                        aZoneSetting.zone.id, 
                                                        aZoneSetting.activateHeating,
                                                        aZoneSetting.temperature, 
                                                        aZoneSetting.duration, 
                                                        authToken));
                }
            });

            var results = await Promise.all(promises);

            schedule.activate();
        }
    }

    deactivate(schedule: ISpecialSchedule): void {
        schedule.deactivate();
        //var resOverlay: IMyTadoOverlay = this.myTadoServiceAdapter.removeOverlayForHomeAndZone(schedule.home.id, "");
    }

    async findAndDeactivateSchedule(homeId: number, specialScheduleId: string) {
        var schedule: ISpecialSchedule | null = this.findSpecialSchedulesById(homeId, specialScheduleId);
        if (schedule != null) {
            console.log("Logging in ...");
            var authToken: MyTadoServiceAuthorization = await this.myTadoServiceAdapter.login();
            console.log("Auth: ", authToken);

            console.log("SpecialSchedule(homeId=" + schedule.home.id + ", id=>" + schedule.id + "<) found, DEactivating it ...");

            var promises : Promise<IMyTadoOverlay>[] = [];
            schedule.settings.forEach(aZoneSetting => {
                if(schedule != null) {
                    promises.push(
                        this.myTadoServiceAdapter.removeOverlayForHomeAndZone(
                                                        schedule.home.id, 
                                                        aZoneSetting.zone.id, 
                                                        authToken));
                }
            });

            var results = await Promise.all(promises);

            schedule.deactivate();
        }
    }

}