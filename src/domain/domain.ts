import db from '../database/db';
import { CartDomain, ItemInCartDomain, ItemDomain, UserDomain } from './models';

interface domain {
    // TODO add types
    getAllItems: () => Promise<ItemDomain[] | Error>,
    addItem: (name: string, price: number) => Promise<string | Error>,
    getItemById: (item_id: number) => Promise<ItemDomain | Error>,
    updateItemById: (item_id: number, name: string, price: number) => Promise<string | Error>,
    deleteItemById: (item_id: number) => Promise<string | Error>,
    getAllUsers: () => Promise<UserDomain[] | Error>,
    addUser: (username: string) => Promise<string | Error>,
    getUserById: (user_id: number) => Promise<UserDomain | Error>,
    updateUserById: (user_id: number, username: string) => Promise<string | Error>,
    deleteUserById: (user_id: number) => Promise<string | Error>,
    getAllCarts: () => Promise<CartDomain[] | Error>,
    addCart: (name: string, user_id: number) => Promise<string | Error>,
    deleteCartsByUserId: (user_id: number) => Promise<string | Error>,
    getCartById: (cart_id: number) => Promise<CartDomain | Error>,
    deleteCartById: (cart_id: number) => Promise<string | Error>,
    getAmountofItemInCart: (cart_id: number, item_id: number) => Promise<number | Error>,
    addItemToCart: (cart_id: number, item_id: number, amount: number) => Promise<string | Error>,
    removeItemFromCart: (cart_id: number, item_id: number, amount: number) => Promise<string | Error>,
    clearCart: (cart_id: number) => Promise<string | Error>
    getAllCartIdsByUserId: (user_id: number) => Promise<number[] | Error>
    getAllCartsByUserId: (user_id: number) => Promise<CartDomain[] | Error>
    calculateCartSum: (content: ItemInCartDomain[]) => number
}

const domain: domain = {
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
        let cartIds = await this.getAllCartIdsByUserId(user_id);
        if (cartIds instanceof Array) {
            for (let index = 0; index < cartIds.length; index++) {
                const cartId = cartIds[index];
                const clearCartResult = await this.clearCart(cartId)
            }
        }
        const deleteCartsResult = await db.deleteCartsByUserId(user_id);
        return deleteCartsResult;
    },

    getAllCartIdsByUserId: async function (user_id: number) {
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
    calculateCartSum: function (content: ItemInCartDomain[]) {
        let sum = 0;
        for (let i = 0; i < content.length; i++) {
            let itemInCart: ItemInCartDomain = content[i];
            let price = itemInCart.item.price;
            let amount = itemInCart.amount;
            sum = sum + price * amount;
        }
        console.log("This is sum: ", sum);
        return sum;
    },
    getCartById: async function (cart_id: number) {
        const cart = await db.getCartMetaById(cart_id);
        if (cart instanceof CartDomain) {
            const content = await db.getCartContent(cart_id)
            if (content instanceof Array) {
                cart.cartItems = content as ItemInCartDomain[]
                cart.cartValue = await this.calculateCartSum(content);
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
        return addItemToCartResult;
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
        return updateResult;
    },

    clearCart: async function (cart_id: number) {
        const clearCartResult = await db.clearCart(cart_id);
        return clearCartResult;
    },

    getAllCartsByUserId: async function (user_id: number) {
        const carts = await db.getAllCartsByUserId(user_id);
        if (carts instanceof Error) {
            return carts;
        }
        return carts;
    }
};

export default domain;
