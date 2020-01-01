export class SpecialSchedule {
    public id: string;
    public description: string;
    public active: boolean;

    constructor(id: string, description: string, active: boolean) {
        this.id = id;
        this.description = description;
        this.active = active;
    }
}
