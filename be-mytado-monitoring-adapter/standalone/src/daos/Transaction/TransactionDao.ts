import { IAccount, Account, ITransaction, Transaction } from '@entities';
import { BigQuery } from '@google-cloud/bigquery';

export interface ITransactionDao {
    getAll: (forAccount: IAccount) => Promise<ITransaction[]>;
}

export class TransactionDao implements ITransactionDao {

    /**
     *
     */
    public async getAll(forAccount: IAccount): Promise<ITransaction[]> {
        var retVal: Transaction[] = [];
        console.log("Retrieve latest 10 txs for account id: ", forAccount.name);

        const bq = new BigQuery();

        const query = ` SELECT CONTO, DATA, CODICE, DESCRIZIONE, CAUSALE, IMPORTO
                        FROM  \`luca-paganelli-formazione.ep.transactions\`
                        WHERE CONTO = @accountName
                        ORDER BY DATA DESC
                        LIMIT 10`;
    
        // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
        const options = {
            query: query,
            // Location must match that of the dataset(s) referenced in the query.
            location: 'EU',
            params: { accountName: forAccount.name }
        };
        
        // Run the query as a job
        const [job] = await bq.createQueryJob(options);
        console.log(`Job ${job.id} started.`);
        
        // Wait for the query to finish
        const [rows] = await job.getQueryResults();
    
        console.log("Results has " + rows.length + " records");

        rows.forEach(row => {
            console.log("Data: ", row['DATA']);
            console.log("Data: ", new Date(row['DATA']['value']));
            retVal.push( new Transaction( new Date(row['DATA']['value']), row['CAUSALE'], row['IMPORTO'] ) );
        });

        return retVal;
    }
}
