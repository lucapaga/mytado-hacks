import { IAnEntity } from "../entities"

export interface IEntityRepository {
    someMethod(someProp: string): IAnEntity[];
}

export class EntityRepository implements IEntityRepository {
    someMethod(someProp: string): IAnEntity[] {
        throw new Error("Method not implemented.");
    }
}