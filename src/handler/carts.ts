import { CartDomain, ItemDomain, ItemInCartDomain } from "../domain/models";
import { CartDTO, ItemInCartDTO } from "./models";
const domain = require('../domain/domain.ts')

module.exports = {
    getAllCarts: async function() {
        try {
            const domainCarts = await domain.getAllCarts();
            if (Object.keys(domainCarts).length === 0) {
                return { status: 404, message: 'No carts found'};
            }
            const dtoCarts = domainCarts.map((cart: CartDomain) => new CartDTO(cart.id, cart.userid, cart.name))
            return { status: 200, data: dtoCarts };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },

    addCart: async function (name: string, userid: number) {
        if (isNaN(userid)) {
            return { status: 400, message: 'Invalid ID supplied' };
        }
        try {
            const userResult = await domain.getUserById(userid);
            if (Object.keys(userResult).length === 0) {
                return { status: 404, message: `Can not find user (user ID: ${userid})`};
            }
            await domain.addCart(name, userid);
            return { status: 201, message: `Added cart with name ${name} for user (user ID: ${userid})` };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },

    deleteCartsByUserId: async function (userid: number) {
        if (isNaN(userid)) {
            return { status: 400, message: 'Invalid ID supplied' };
        }
        try {
            let userResult = await domain.getUserById(userid);
            if (Object.keys(userResult).length === 0) {
                return { status: 404, message: `Can not find user (user ID: ${userid})`};
            }
            await domain.deleteCartsByUserId(userid);
            return { status: 200, message: `Deleted all carts from user (user ID: ${userid})` };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },

    getCartById: async function (cartid: number) {
        if (isNaN(cartid)) {
            return { status: 400, message: 'Invalid ID supplied' };
        }
        try {
            let domainCart: CartDomain = await domain.getCartById(cartid);
            console.log("domainCart is: ", JSON.stringify(domainCart))
            const dtoCart = new CartDTO(domainCart.id, domainCart.userid, domainCart.name);
            if (domainCart.cartItems instanceof Array) {
                const dtoCartItems = domainCart.cartItems.map((cartItem: ItemInCartDomain) => new ItemInCartDTO(cartItem.item.id, cartItem.amount));
                dtoCart.items = dtoCartItems
            }
            
            return { status: 200, data: dtoCart };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },

    deleteCartById: async function (cartid: number) {
        if (isNaN(cartid)) {
            return { status: 400, message: 'Invalid ID supplied' };
        }
        try {
            let cartResult = await domain.getCartById(cartid);
            if (Object.keys(cartResult).length === 0) {
                return { status: 404, message: `Can not find cart (cart ID: ${cartid})`};
            }
            await domain.deleteCartById(cartid);
            return { status: 200, message: `Deleted cart (cart ID: ${cartid})` };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },

    addItemToCart: async function (cartId: number, itemId: number, amount: number) {
        if (isNaN(cartId) || isNaN(itemId)) {
            return { status: 400, message: 'Invalid cart or item ID supplied' };
        }
        let cartResult = await domain.getCartById(cartId);
            if (Object.keys(cartResult).length === 0) {
                return { status: 404, message: `Can not find cart (cart ID: ${cartId})`};
            }
        try {
            await domain.addItemToCart(cartId, itemId, amount);
            return { status: 200, message: `Added ${amount} of item into cart (item ID: ${itemId}, cart ID: ${cartId})` };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },

    removeItemFromCart: async function (cartId: number, itemId: number) {
        if (isNaN(cartId) || isNaN(itemId)) {
            return { status: 400, message: 'Invalid cart or item ID supplied' };
        }
        try {
            let cartResult = await domain.getCartById(cartId);
            if (Object.keys(cartResult).length === 0) {
                return { status: 404, message: `Can not find cart (cart ID: ${cartId})`};
            }
            const domainContentResult = await domain.getItemInCart(cartId, itemId);
            if (Object.keys(domainContentResult).length === 0) {
                return { status: 404, message: `No entry for item in cart found (item ID: ${itemId}, cart ID: ${cartId})`};
            }
            await domain.removeItemFromCart(cartId, itemId);
            return { status: 200, message: `Removed item from cart (item ID: ${itemId}, cart ID: ${cartId})` };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },

    clearCart: async function (cartId: number) {
        if (isNaN(cartId)) {
            return { status: 400, message: 'Invalid ID supplied' };
        }
        try {
            let domainCartResult = await domain.getCartById(cartId);
            if (Object.keys(domainCartResult). length === 0) {
                return { status: 404, message: `Can not find cart (cart ID: ${cartId})`};
            }
            await domain.clearCart(cartId);
            return { status: 200, message: `Cart cleared (cart ID: ${cartId})` };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    }
}
