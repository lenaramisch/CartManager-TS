const domain = require('../domain/domain.ts');
import { ItemDTO} from './models';
import { ItemDB } from '../database/models';

module.exports = {
    //Testing
    /* getItems: async function () {
            const itemResult: string[] = ["Nutella", "Apple", "Banana"];
            return { status: 200, data: itemResult };
    } */

    getAllItems: async function () {
        try {
            const itemResult = await domain.getAllItems();
            if (Object.keys(itemResult).length === 0) {
                return { status: 404, message: 'No items found'};
            }
            //const dbModelItem: ItemDB[] = dbResult.rows.map((row: ItemRow) => new ItemDB(row.id, row.price, row.name, row.created_at));
            let itemsDto: ItemDB[] = itemResult.map((dbItem: ItemDB)  => new ItemDTO(dbItem.id, dbItem.name, dbItem.price));
            return { status: 200, data: itemsDto };
        } catch (err) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },
/* 
    addItem: async function (name, price) {
        try {
            await domain.addItem(name, price);
            return { status: 201, message: `Added item ${name} with a price of ${price}` };
        } catch (err) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },

    deleteItemById: async function (itemId) {
        let parsedId = parseInt(itemId);
        if (isNaN(parsedId)) {
            return { status: 400, message: 'Invalid ID supplied' };
        }
        try {
            const itemResult = await domain.getItemById(itemId);
            if (Object.keys(itemResult).length === 0) {
                return { status: 404, message: `Can not find item (item ID: ${itemId})`};
            }
            await domain.deleteItemById(itemId);
            return { status: 200, message: `Deleted item (item ID: ${itemId})` };
        } catch (err) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },

    getItemById: async function (itemId) {
        let parsedId = parseInt(itemId);
        if (isNaN(parsedId)) {
            return { status: 400, message: 'Invalid ID supplied' };
        }
        try {
            const itemResult = await domain.getItemById(itemId);
            if (Object.keys(itemResult).length === 0) {
                return { status: 404, message: `Can not find item (item ID: ${itemId})`};
            }
            let DtoItemResult = itemResult.map(item => new dto.Item(item.id, item.name, item.price));
            return { status: 200, data: DtoItemResult };
        } catch (err) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },

    updateItemById: async function (itemId, name, price) {
        let parsedId = parseInt(itemId);
        if (isNaN(parsedId)) {
            return { status: 400, message: 'Invalid ID supplied' };
        }
        try {
            const itemResult = await domain.getItemById(itemId);
            if (Object.keys(itemResult).length === 0) {
                return { status: 404, message: `Can not find item (item ID: ${itemId})`};
            }
            const updateItemResult = domain.updateItemById(name, price, itemId);
            return { status: 200, message: 'Update done' };
        } catch (err) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    } */
};
