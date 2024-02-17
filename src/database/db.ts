const { Pool } = require('pg');
import { ItemDomain, UserDomain } from '../domain/models';
import { ItemDB, UserDB } from './models';

//All the DB Querys:
//item querys
const getAllItemsQuery: string = 'SELECT * FROM items';
const addItemQuery: string = 'INSERT INTO items(name, price) VALUES($1, $2)';
const getItemByIdQuery: string = 'SELECT * FROM items WHERE id = $1';
const updateItemByIdQuery: string = 'UPDATE items SET name = $2, price = $3 WHERE id = $1';
const deleteItemByIdQuery: string = 'DELETE FROM items WHERE id = $1';
//user querys
const getAllUsersQuery = 'SELECT * FROM users';
const addUserQuery = 'INSERT INTO users(username) VALUES($1)';
const getUserByIdQuery = 'SELECT * FROM users WHERE id = $1';
const updateUserByIdQuery = 'UPDATE users SET username = $2 WHERE id = $1';
const deleteUserByIdQuery = 'DELETE FROM users WHERE id = $1';

interface ItemRow {
    id: number;
    price: number;
    name: string;
    created_at: string;
}

interface UserRow {
    id: number,
    username: string,
    created_at: string
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
    //item endpoints
    getAllItems: () => Promise<ItemDomain[] | Error>;
    addItem: (name: string, price: number) => Promise<string | Error>;
    getItemById: (item_id: number) => Promise<ItemDomain | Error>;
    updateItemById: (item_id: number, name: string, price: number) => Promise<string | Error>;
    deleteItemById: (item_id: number) => Promise<string | Error>;
    //user endpoints
    getAllUsers: () => Promise<UserDomain[] | Error>;
    addUser: (username: string) => Promise<string | Error>;
    getUserById: (user_id: number) => Promise<UserDomain | Error>;
    updateUserById: (user_id: number, username: string) => Promise<string | Error>;
    deleteUserById: (user_id: number) => Promise<string | Error>;
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
    },
    addItem: async function (name, price): Promise< string | Error> {
        try {
            pool.query(addItemQuery, [name, price])
            return "ok"
        }
        catch (error: any) {
            return error;
        }
    },
    getItemById: async function  (item_id: number): Promise<ItemDomain | Error> {
        try {
            const dbResult = await pool.query(getItemByIdQuery, [item_id]);
            const dbModelItem = dbResult.rows.map((row: ItemRow) => new ItemDB(row.id, row.price, row.name, row.created_at))
            return dbModelItem.map((dbItem: ItemDB) => new ItemDomain(dbItem.id, dbItem.price, dbItem.name, dbItem.created_at))
        } catch (error: any) {
            return error
        }
    },
    updateItemById: async function (item_id: number, name: string, price: number): Promise<string | Error> {
        try {
            pool.query(updateItemByIdQuery, [item_id, name, price])
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    deleteItemById: async function (item_id: number) {
        try {
            pool.query(deleteItemByIdQuery, [item_id])
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    getAllUsers: async function () {
        try{
            const dbResult = await pool.query(getAllUsersQuery);
            // map raw QueryResult to db model classes
            const dbModelUser = dbResult.rows.map((row: UserRow) => new UserDB(row.id, row.username, row.created_at))
            // map db model carts to domain model carts
            return dbModelUser.map((dbUser: UserDB) => new UserDomain(dbUser.id, dbUser.username));
        } catch (error: any) {
            return error
        }
    },
    addUser: async function (username: string) {
        try {
            pool.query(addUserQuery, [username]);
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    getUserById: async function (user_id: number) {
        try {
            const dbResult = await pool.query(getUserByIdQuery, [user_id]);
            const dbModelUser = dbResult.rows.map((row: UserRow) => new UserDB(row.id, row.username, row.created_at));
            return dbModelUser.map((dbUser: UserDB) => new UserDomain(dbUser.id, dbUser.username))
        } catch (error: any) {
            return error
        }
    },
    updateUserById: async function (user_id: number, username: string) {
        try {
            pool.query(updateUserByIdQuery, [user_id, username])
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    deleteUserById: async function (user_id: number) {
        try {
            pool.query(deleteUserByIdQuery, [user_id])
            return "ok"
        } catch (error: any) {
            return error
        }
    }
};
export default database;
