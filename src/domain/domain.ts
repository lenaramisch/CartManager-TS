import db from '../database/db';
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
    }
};
