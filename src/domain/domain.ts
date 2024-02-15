import db from '../database/db';
module.exports = {
    getAllItems: async function () {
        const allItems = await db.getAllItems();
        return allItems;
    }
};
