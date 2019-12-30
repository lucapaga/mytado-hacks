import { ISpecialSchedule, SpecialSchedule } from "../entities/SpecialSchedule"

export interface ISpecialScheduleRepository {
    retrieveForHome(homeId: string): ISpecialSchedule[];
}

export class SpecialScheduleRepository implements ISpecialScheduleRepository {
    retrieveForHome(homeId: string): ISpecialSchedule[] {
        return [];
    }
}