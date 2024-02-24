import domain from "../domain/domain";
import { ItemDTO} from './models';
import { ItemDomain } from '../domain/models';

module.exports = {
    getAllItems: async function () {
        try {
            const itemResult = await domain.getAllItems();
            if (Object.keys(itemResult).length === 0) {
                return { status: 404, message: 'No items found'};
            }
            if (itemResult instanceof Error) {
                return { status: 500, message: 'Internal Server Error'};
            }
            //const dbModelItem: ItemDB[] = dbResult.rows.map((row: ItemRow) => new ItemDB(row.id, row.price, row.name, row.created_at));
            let itemsDto = itemResult.map((dbItem: ItemDomain)  => new ItemDTO(dbItem.id, dbItem.name, dbItem.price));
            return { status: 200, data: itemsDto };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },
    addItem: async function (name: string, price: number) {
        try {
            await domain.addItem(name, price);
            return { status: 201, message: `Added item ${name} with a price of ${price}` };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },
    getItemById: async function (itemId:number) {
        if (isNaN(itemId)) {
            return { status: 400, message: 'Invalid ID supplied' };
        }
        try {
            const itemResult = await domain.getItemById(itemId);
            if (itemResult instanceof ItemDomain) {
                return { status: 200, data: new ItemDTO(itemResult.id, itemResult.name, itemResult.price)};
            }
            return { status: 404, message: `Cannot find item (item ID: ${itemId})` };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },
    updateItemById: async function (itemId: number, name: string, price: number) {
        if (typeof(itemId) !== "number") {
            return { status: 400, message: 'Invalid ID supplied' };
        }
        try {
            const itemResult = await domain.getItemById(itemId);
            if (Object.keys(itemResult).length === 0) {
                return { status: 404, message: `Cannot find item (item ID: ${itemId})` };
            }
            domain.updateItemById(itemId, name, price);
            return { status: 200, message: 'Update done' };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },
    deleteItemById: async function (itemId: number) {
        if (typeof(itemId) !== "number") {
            return { status: 400, message: 'Invalid ID supplied' };
        }
        try {
            const itemResult = await domain.getItemById(itemId);
            if (Object.keys(itemResult).length === 0) {
                return { status: 404, message: `Cannot find item (item ID: ${itemId})` };
            }
            domain.deleteItemById(itemId);
            return { status: 200, message: `Deleted item (item ID: ${itemId})` };
        } catch (err) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    }
};
