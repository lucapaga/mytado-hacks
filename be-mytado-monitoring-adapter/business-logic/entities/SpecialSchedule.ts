import { ISpecialScheduleRepository, SpecialScheduleRepository } from "../repositories"
import { IMyTadoServicesAdapter, MyTadoServicesAdapter } from "../services"
import { IHome } from "./"

export interface ISpecialSchedule {
    id: string;
    description: string;
    home: IHome;
    isActive: boolean;

    findSpecialSchedulesForHome(homeId: string): ISpecialSchedule[];
    activate(): void;
    deactivate(): void;
}

export class SpecialSchedule implements ISpecialSchedule {
    public id: string;
    public description: string;
    public home: IHome;
    public isActive: boolean = false;

    private specialScheduleRepository: ISpecialScheduleRepository = new SpecialScheduleRepository();
    private myTadoServices: IMyTadoServicesAdapter = new MyTadoServicesAdapter();

    constructor(id: string, description: string, home: IHome, isActive?: boolean) {
        this.id = id;
        this.description = description;
        this.home = home;

        if (isActive != null) { this.isActive = isActive; }
    }

    findSpecialSchedulesForHome(homeId: string): ISpecialSchedule[] {
        return this.specialScheduleRepository.retrieveForHome(homeId);
    }

    activate(): void { 
        this.myTadoServices.addTimedTemperatureOverlayForHomeAndZone(this.home.id, "", 10, 1800);
    }

    deactivate(): void {
        this.myTadoServices.removeOverlayForHomeAndZone(this.home.id, "");
     }
}
