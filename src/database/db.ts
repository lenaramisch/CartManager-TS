const { Pool } = require('pg');
import { CartDomain, ItemDomain, UserDomain, ItemInCartDomain } from '../domain/models';
import { CartDB, ItemDB, ItemInCartDB, UserDB } from './models';

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
//cart querys
const getAllCartsQuery = 'SELECT * FROM carts';
const addCartQuery = 'INSERT INTO carts(name, user_id) VALUES($1, $2)';
const deleteCartsByUserIdQuery = 'DELETE FROM carts WHERE user_id = $1';
const getCartByIdQuery = 'SELECT * FROM carts WHERE id = $1';
const deleteCartByIdQuery = 'DELETE FROM carts WHERE id = $1';
//cart content (item in cart) querys
const getCartContentQuery = 'SELECT * FROM item_in_cart WHERE cart_id = $1';
const getItemInCartQuery = 'SELECT * FROM item_in_cart WHERE cart_id = $1 AND item_id = $2';
const addItemToCartQuery = 'INSERT INTO item_in_cart(cart_id, item_id, amount) VALUES($1, $2, $3)';
const removeItemFromCartQuery = 'DELETE FROM item_in_cart WHERE cart_id = $1 AND item_id = $2';
const clearCartQuery = 'DELETE FROM item_in_cart WHERE cart_id = $1';
const editAmountofItemInCartQuery = 'UPDATE item_in_cart SET amount = $1 WHERE cart_id = $2 AND item_id = $3';

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

interface CartRow {
    id: number,
    user_id: number,
    name: string,
    created_at: string
}

interface ItemInCartRow {
    id: number,
    cart_id: number,
    item_id: number,
    amount: number,
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
    //item 
    getAllItems: () => Promise<ItemDomain[] | Error>;
    addItem: (name: string, price: number) => Promise<string | Error>;
    getItemById: (item_id: number) => Promise<ItemDomain | Error>;
    updateItemById: (item_id: number, name: string, price: number) => Promise<string | Error>;
    deleteItemById: (item_id: number) => Promise<string | Error>;
    //user 
    getAllUsers: () => Promise<UserDomain[] | Error>;
    addUser: (username: string) => Promise<string | Error>;
    getUserById: (user_id: number) => Promise<UserDomain | Error>;
    updateUserById: (user_id: number, username: string) => Promise<string | Error>;
    deleteUserById: (user_id: number) => Promise<string | Error>;
    //cart 
    getAllCarts: () => Promise<CartDomain[] | Error>;
    addCart: (name: string, user_id: number) => Promise<string | Error>;
    deleteCartsByUserId: (user_id: number) => Promise<string | Error >;
    getCartMetaById: (cart_id: number) => Promise<CartDomain | Error>;
    deleteCartById: (cart_id: number) => Promise<string | Error>;
    getCartContent: (cart_id: number) => Promise<ItemInCartDomain[]| Error>;
    /* ------ */
    getAmountOfItemInCart: (cart_id: number, item_id: number) => Promise<number| Error>;
    updateAmountofItemInCart: (cart_id: number, item_id: number, amount: number) => Promise<string | Error>;
    addItemToCart: (cart_id: number, item_id: number, amount: number) => Promise<string | Error>;
    removeItemFromCart: (cart_id: number, item_id: number) => Promise<string | Error>;
    clearCart: (cart_id: number) => Promise<string | Error>;
}

const database: Database = {
    query: (text, params) => pool.query(text, params),
    getAllItems: async function (): Promise<ItemDomain[] | Error> {
        try {
            const dbResult = await pool.query(getAllItemsQuery);
            // map raw query result to db model classes
            const dbModelItem: ItemDB[] = dbResult.rows.map((row: ItemRow) => new ItemDB(row.id, row.price, row.name, row.created_at));
            // map db model items to domain model items
            return dbModelItem.map(dbItem => new ItemDomain(dbItem.id, dbItem.price, dbItem.name));
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
            const domainModel = dbModelItem.map((dbItem: ItemDB) => new ItemDomain(dbItem.id, dbItem.price, dbItem.name))
            return domainModel[0]
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
    },
    getAllCarts: async function () {
        try{
            const dbResult = await pool.query(getAllCartsQuery);
            // map raw QueryResult to db model classes
            const dbModelCarts = dbResult.rows.map((row: CartRow )=> new CartDB(row.id, row.user_id, row.name, row.created_at))
            // map db model carts to domain model carts
            return dbModelCarts.map((dbCart: CartDB) => new CartDomain(dbCart.id, dbCart.user_id, dbCart.name));
        } catch (error: any) {
            return error
        }
    },
    addCart: async function (name: string, user_id: number) {
        try {
            pool.query(addCartQuery, [name, user_id]);
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    deleteCartsByUserId: async function (user_id: number) {
        try {
            pool.query(deleteCartsByUserIdQuery, [user_id]);
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    getCartMetaById: async function (cart_id: number) {
        try {
            const dbResult = await pool.query(getCartByIdQuery, [cart_id]);
            // map raw QueryResult to db model
            const dbModelCart = dbResult.rows.map((row: CartRow) => new CartDB(row.id, row.user_id, row.name, row.created_at))
            // map db model to domain model
            const domainModelCart = dbModelCart.map((dbCart: CartDB) => new CartDomain(dbCart.id, dbCart.user_id, dbCart.name));
            return domainModelCart[0]
        } catch (error) {
            return error
        }
    },
    deleteCartById: async function (cart_id: number) {
        try {
            pool.query(deleteCartByIdQuery, [cart_id]);
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    getCartContent: async function (cart_id: number) {
        try {
            // query the database
            const dbResult = await pool.query(getCartContentQuery, [cart_id]);
            if (Object.keys(dbResult).length === 0) {
                return [];
            }
            // map the raw QueryResult to db model
            const dbModelItemInCart: ItemInCartDB[] = dbResult.rows.map((row :ItemInCartRow) => new ItemInCartDB(row.id, row.cart_id, row.item_id, row.amount, row.created_at))

            // map db model to domain model
            const promises: Promise<ItemInCartDomain | Error>[] = dbModelItemInCart.map(async (dbModelItemInCart) => {
                const domainItem = await this.getItemById(dbModelItemInCart.item_id);
                if (domainItem instanceof Error) {
                    return new Error("Error occurred while creating ItemInCartDomain"); // Return an Error object
                }
                const amount = dbModelItemInCart.amount;
                return new ItemInCartDomain(domainItem, amount);
            });
            
            // await all promises
            const itemInCartDomain = await Promise.all(promises);

            return itemInCartDomain
        } catch (error: any) {
            return error;
        }
    },
    getAmountOfItemInCart: async function (cart_id: number, item_id: number): Promise<number | Error> {
        try {
            const dbResult = await pool.query(getItemInCartQuery, [cart_id, item_id]);
            // if the item is not in the cart, return 0
            if (dbResult.rows.length === 0) {
                return 0;
            }
            const dbModelItemInCart = dbResult.rows.map((row: ItemInCartRow )=> new ItemInCartDB(row.id, row.cart_id, row.item_id, row.amount, row.created_at));
            return dbModelItemInCart[0].amount;
        } catch (error: any) {
            return error;
        }
    },
    updateAmountofItemInCart: async function (cart_id: number, item_id: number, amount: number) {
        try {
            // if the amount is 0 or below, remove the item from the cart
            if (amount <= 0) {
                return this.removeItemFromCart(cart_id, item_id);
            }
            const updateResult = await pool.query(editAmountofItemInCartQuery, [amount, cart_id, item_id]);
            if (updateResult instanceof Error) {
                return updateResult;
            }
            return "ok"
        }
        catch (error: any) {
            return error;
        }
    },
    addItemToCart: async function (cart_id: number, item_id: number, amount: number) {
        try {
            // Get the amount of items in the cart and add the new amount to it
            const alreadyInCartAmount = await this.getAmountOfItemInCart(cart_id, item_id);
            if (alreadyInCartAmount instanceof Error) {
                return alreadyInCartAmount;
            }

            if (alreadyInCartAmount === 0) {
                // if the item is not in the cart, add it
                const addResult = await pool.query(addItemToCartQuery, [cart_id, item_id, amount]);
                if (addResult instanceof Error) {
                    return addResult;
                }
                return "ok"
            }
            
            // if the item is already in the cart, update the amount
            const newAmount :number = alreadyInCartAmount + amount;
            const updateResult = await this.updateAmountofItemInCart(cart_id, item_id, newAmount);
            if (updateResult instanceof Error) {
                return updateResult;
            }
        } catch (error: any) {
            return error
        }
    },
    removeItemFromCart: async function (cart_id: number, item_id: number) {
        try {
            pool.query(removeItemFromCartQuery, [cart_id, item_id]);
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    clearCart: async function (cart_id: number) {
        try {
            pool.query(clearCartQuery, [cart_id]);
            return "ok"
        } catch (error: any) {
            return error
        }
    }
};
export default database;
