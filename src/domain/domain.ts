import db from '../database/db';
import { CartDB } from '../database/models';
import { CartDomain, ItemInCartDomain } from './models';

module.exports = {
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
        const deleteCartsResult = await db.deleteCartsByUserId(user_id);
        return deleteCartsResult;
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
        if (addItemToCartResult !== "ok") {
            return new Error('could not add item to cart');
        }
        return addItemToCartResult;
    },

    removeItemFromCart: async function (cart_id: number, item_id: number, amount: number) {
        // Check if the item is in the cart
        const amountOfItemInCart = await db.getAmountOfItemInCart(cart_id, item_id);
        if (amountOfItemInCart instanceof Error) {
            return amountOfItemInCart;
        }
        // update the amount of the item in the cart
        const removeItemFromCartResult = await db.updateAmountofItemInCart(cart_id, item_id, amountOfItemInCart - amount);

        return removeItemFromCartResult;
    },

    clearCart: async function (cart_id: number) {
        const clearCartResult = await db.clearCart(cart_id);
        return clearCartResult;
    }
};
