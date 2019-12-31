import { ISpecialSchedule, SpecialSchedule, Home, Zone, ScheduleSetting } from "../entities"

export interface ISpecialScheduleRepository {
    retrieveForHome(homeId: number): ISpecialSchedule[];
    retrieveSpecialScheduleByHomeAndId(homeId: number, specialScheduleId: string): ISpecialSchedule | null;
}

export class SpecialScheduleRepository implements ISpecialScheduleRepository {

    private mockSpecialSchedules: ISpecialSchedule[] = [
        new SpecialSchedule(
            "mock1",
            "Cenone di Capodanno",
            new Home(422292, "Luca & Chiara"),
            [
                new ScheduleSetting(new Zone(1, "SALA"), 1800, false),
                new ScheduleSetting(new Zone(2, "CAMERA MATRIMONIALE"), 1800, true, 20),
                new ScheduleSetting(new Zone(3, "CAMERA BIMBI (P)"), 1800, true, 20),
                new ScheduleSetting(new Zone(4, "CAMERA BIMBI (G)"), 1800, true, 20),
                new ScheduleSetting(new Zone(5, "SALA (T)"), 1800, true, 22)
            ])
    ];

    retrieveForHome(homeId: number): ISpecialSchedule[] {
        console.info("Getting ss for home ", homeId);
        var filteredSchedules: ISpecialSchedule[] = [];
        this.mockSpecialSchedules.forEach(anSS => {
            if (anSS.home.id == homeId) {
                filteredSchedules.push(anSS);
            }
        });
        return filteredSchedules;
    }

    retrieveSpecialScheduleByHomeAndId(homeId: number, specialScheduleId: string): ISpecialSchedule | null {
        console.info("Getting ss with id " + specialScheduleId + " for home " + homeId);
        var whatToReturn: ISpecialSchedule | null = null;

        this.mockSpecialSchedules.forEach(anSS => {
            //console.log("Examining SS [home=" + anSS.home.id + ", id=>" + anSS.id + "<]");
            if (anSS.home.id == homeId && anSS.id === specialScheduleId) {
                //console.log("It matched! Returning ...");
                whatToReturn = anSS;
            }
        });

        return whatToReturn;
    }

}