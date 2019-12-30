const usingMockDb = (process.env.USE_MOCK_DB || '').toLowerCase();
let userDaoPath = './User/UserDao';
let accountDaoPath = './Account/AccountDao';
let transactionDaoPath = './Transaction/TransactionDao';

if (usingMockDb === 'true') {
    userDaoPath += '.mock';
    //accountDaoPath += '.mock';
}

// tslint:disable:no-var-requires
export const { UserDao } = require(userDaoPath);
export const { AccountDao } = require(accountDaoPath);
export const { TransactionDao } = require(transactionDaoPath);
