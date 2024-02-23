import { isArrayBuffer } from 'util/types';
import db from '../database/db';
import { CartDomain, ItemInCartDomain } from './models';
import { clear } from 'console';

interface domain {
    // TODO add types
    getAllItems: () => Promise<any>,
    addItem: (name: string, price: number) => Promise<any>,
    getItemById: (item_id: number) => Promise<any>,
    updateItemById: (item_id: number, name: string, price: number) => Promise<any>,
    deleteItemById: (item_id: number) => Promise<any>,
    getAllUsers: () => Promise<any>,
    addUser: (username: string) => Promise<any>,
    getUserById: (user_id: number) => Promise<any>,
    updateUserById: (user_id: number, username: string) => Promise<any>,
    deleteUserById: (user_id: number) => Promise<any>,
    getAllCarts: () => Promise<any>,
    addCart: (name: string, user_id: number) => Promise<any>,
    deleteCartsByUserId: (user_id: number) => Promise<any>,
    getCartById: (cart_id: number) => Promise<any>,
    deleteCartById: (cart_id: number) => Promise<any>,
    getAmountofItemInCart: (cart_id: number, item_id: number) => Promise<any>,
    addItemToCart: (cart_id: number, item_id: number, amount: number) => Promise<any>,
    removeItemFromCart: (cart_id: number, item_id: number, amount: number) => Promise<any>,
    clearCart: (cart_id: number) => Promise<any>
    getAllCartsByUserId: (user_id: number) => Promise<any[] | Error>
}

const domain :domain = {
    getAllItems: async function () {
        const allItems = await db.getAllItems();
        return allItems;
    },
    addItem: async function (name: string, price: number) {
        const addItemResult = await db.addItem(name, price);
        return addItemResult;
    },
    getItemById: async function (item_id: number) {
        const item = await db.getItemById(item_id);
        return item;
    },
    updateItemById: async function (item_id: number, name: string, price: number) {
        const updateItemResult = await db.updateItemById(item_id, name, price);
        return updateItemResult;
    },
    deleteItemById: async function (item_id: number) {
        const deleteItemResult = await db.deleteItemById(item_id);
        return deleteItemResult;
    },
    getAllUsers: async function () {
        const allUsers = await db.getAllUsers();
        return allUsers;
    },

    addUser: async function (username: string) {
        const addUserResult = await db.addUser(username);
        return addUserResult;
    },

    getUserById: async function (user_id: number) {
        const user = await db.getUserById(user_id);
        return user;
    },

    updateUserById: async function (user_id: number, username: string) {
        const updateUserResult = await db.updateUserById(user_id, username);
        return updateUserResult;
    },

    deleteUserById: async function (user_id: number) {
        const deleteUserResult = await db.deleteUserById(user_id);
        return deleteUserResult;
    },
    getAllCarts: async function() {
        const carts = await db.getAllCarts();
        return carts;
    },

    addCart: async function(name: string, user_id: number) {
        const addCartResult = await db.addCart(name, user_id);
        return addCartResult;
    },

    deleteCartsByUserId: async function (user_id: number) {
        let cartIds = await this.getAllCartsByUserId(user_id);
        console.log("cartIds: ", JSON.stringify(cartIds))
        if (cartIds instanceof Array) {
            for (let index = 0; index < cartIds.length; index++) {
                const cartId = cartIds[index];
                const clearCartResult = await this.clearCart(cartId)
                console.log("Clear Cart Result: ", JSON.stringify(clearCartResult))
            }
        }
        const deleteCartsResult = await db.deleteCartsByUserId(user_id);
        return deleteCartsResult;
    },

    getAllCartsByUserId: async function (user_id: number) {
        const carts = await db.getAllCartsByUserId(user_id);
        if (carts instanceof Error) {
            return carts;
        }
        let cart_ids: number[] = [];
        carts.forEach(cart => {
            cart_ids.push(cart.id)
        });
        return cart_ids;
    },

    getCartById: async function (cart_id: number) {
        const cart = await db.getCartMetaById(cart_id);
        if (cart instanceof CartDomain) {
            const content = await db.getCartContent(cart_id)
            if (content instanceof Array) {
                cart.cartItems = content as ItemInCartDomain[]
            }
        }
        
        return cart;
    },
    deleteCartById: async function (cart_id: number) {
        const deleteCartResult = await db.deleteCartById(cart_id);
        return deleteCartResult;
    },
    getAmountofItemInCart: async function (cart_id: number, item_id: number) {
        const amountOfItemInCart = await db.getAmountOfItemInCart(cart_id, item_id);
        return amountOfItemInCart;
    },
    addItemToCart: async function (cart_id: number, item_id: number, amount: number) { 
        let cartResult = await this.getCartById(cart_id);
        if (cartResult instanceof Error) {
            return new Error('cart does not exist');
        }
        let itemResult = await this.getItemById(item_id);
        if (itemResult instanceof Error) {
            return new Error('item does not exist');
        }
        const addItemToCartResult = await db.addItemToCart(cart_id, item_id, amount);
        if (addItemToCartResult instanceof Error) {
            return new Error('internal server error');
        }
    },

    removeItemFromCart: async function (cart_id: number, item_id: number, amount: number) {
        let cartResult = await this.getCartById(cart_id);
        if (cartResult instanceof Error) {
            return new Error('cart does not exist');
        }
        let itemResult = await this.getItemById(item_id);
        if (itemResult instanceof Error) {
            return new Error('item does not exist');
        }
        
        // Check if the item is in the cart
        const amountOfItemInCart = await db.getAmountOfItemInCart(cart_id, item_id);
        if (amountOfItemInCart instanceof Error) {
            return new Error('internal server error');
        }
        // update the amount of the item in the cart
        const updateResult = await db.updateAmountofItemInCart(cart_id, item_id, amountOfItemInCart - amount);
        if (updateResult instanceof Error) {
            return new Error('internal server error');
        }
    },

    clearCart: async function (cart_id: number) {
        const clearCartResult = await db.clearCart(cart_id);
        return clearCartResult;
    }
};

export default domain;
