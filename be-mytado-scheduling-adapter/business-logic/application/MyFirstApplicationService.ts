import { IEntityRepository, EntityRepository } from "../repositories";
import { IAnEntity } from "../entities";


export class MyFirstApplicationService {
    private entityRepository: IEntityRepository = new EntityRepository();

    doSomethingSpecial(something: string): IAnEntity[] {
        return this.entityRepository.someMethod(something);
    }

}