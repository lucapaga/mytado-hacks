import { IAccount, Account } from '@entities';
import { BigQuery } from '@google-cloud/bigquery';

export interface IAccountDao {
    getAll: () => Promise<IAccount[]>;
}

export class AccountDao implements IAccountDao {

    /**
     *
     */
    public async getAll(): Promise<IAccount[]> {
        const bq = new BigQuery();

        const query = ` SELECT TIPO, CONTO, SUM(IMPORTO) as AMOUNT
                        FROM  \`luca-paganelli-formazione.ep.transactions\`
                        GROUP BY TIPO, CONTO`;
    
        // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
        const options = {
            query: query,
            // Location must match that of the dataset(s) referenced in the query.
            location: 'EU',
        };
        
        // Run the query as a job
        const [job] = await bq.createQueryJob(options);
        console.log(`Job ${job.id} started.`);
        
        // Wait for the query to finish
        const [rows] = await job.getQueryResults();
    
        var retVal: Account[] = [];
        rows.forEach(row => retVal.push(new Account(row['TIPO'], row['CONTO'], row['AMOUNT'])));
        return retVal;
    }
}
