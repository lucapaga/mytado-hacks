import { IAccount } from '@entities';
import { getRandomInt } from '@shared';
import { MockDaoMock } from '../MockDb/MockDao.mock';
import { IAccountDao } from './AccountDao';
import { Account } from 'src/entities/Account';

export class AccountDao /*extends MockDaoMock*/ implements IAccountDao {

    public async getAll(): Promise<IAccount[]> {
        try {
            //const db = await super.openDb();
            /*
            {id: "8427983247928437", type: "CC", name: "ING DIRECT CCA", amount: 1234.22},
            {id: "7667C76C7D676767", type: "CC", name: "WEBANK CC", amount: 34.22},
            {id: "78C7D897C987D98C", type: "CDEP", name: "ING CONTO ARANCIO", amount: 1834.22},
            {id: "3435663427654732", type: "LIBRETTO", name: "COOP LUCA", amount: 234.22}
            */
            return [ 
                new Account("CC",       "ING DIRECT CCA",    1234.22, "8427983247928437"), 
                new Account("CC",       "WEBANK CC",           34.22, "7667C76C7D676767"),
                new Account("CDEP",     "ING CONTO ARANCIO", 1834.22, "78C7D897C987D98C"),
                new Account("LIBRETTO", "COOP LUCA",          234.22, "3435663427654732")
            ];
        } catch (err) {
            throw err;
        }
    }
}
