const { Pool } = require('pg');
import { ItemDomain } from '../domain/models';
import { ItemDB } from './models';

//All the DB Querys:
const getAllItemsQuery: string = 'SELECT * FROM items';

interface ItemRow {
    id: number;
    price: number;
    name: string;
    created_at: string;
}

const pool = new Pool({
    user: 'postgres',
    password: 'changeme',
    host: 'localhost', // for local development (nodemon)
    // host: 'postgres', // if we run node in docker
    port: 5432, // default Postgres port
    database: 'postgres'
});

interface Database {
    query: (text: string, params?: any[]) => Promise<{ rows: ItemRow[] }>;
    getAllItems: () => Promise<ItemDomain[] | Error>;
}

const database: Database = {
    query: (text, params) => pool.query(text, params),
    getAllItems: async function (): Promise<ItemDomain[] | Error> {
        try {
            const dbResult = await pool.query(getAllItemsQuery);
            // map raw query result to db model classes
            const dbModelItem: ItemDB[] = dbResult.rows.map((row: ItemRow) => new ItemDB(row.id, row.price, row.name, row.created_at));
            // map db model items to domain model items
            return dbModelItem.map(dbItem => new ItemDomain(dbItem.id, dbItem.price, dbItem.name, dbItem.created_at));
        } catch (error: any) {
            return error;
        }
    }
};

export default database;
