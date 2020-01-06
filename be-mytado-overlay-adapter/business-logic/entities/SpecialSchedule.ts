import { IHome } from "./Home"
import { IScheduleSetting } from "./ScheduleSetting";

export interface ISpecialSchedule {
    id: string;
    description: string;
    home: IHome;
    settings: IScheduleSetting[];
    isActive: boolean;

    activate(): void;
    deactivate(): void;
}

export class SpecialSchedule implements ISpecialSchedule {
    public id: string;
    public description: string;
    public home: IHome;
    public settings: IScheduleSetting[];
    public isActive: boolean = false;

    constructor(id: string, description: string, home: IHome, settings: IScheduleSetting[], isActive?: boolean) {
        this.id = id;
        this.description = description;
        this.home = home;
        this.settings = settings;

        if (isActive != null) { this.isActive = isActive; }
    }

    activate(): void { 
        this.isActive = true;
    }

    deactivate(): void {
        this.isActive = false;
     }
}
