import express, {Request, Response} from 'express';

const users = require('./handler/users.ts');
const items = require('./handler/items.ts');
const carts = require('./handler/carts.ts');

module.exports = function(app: any) {
    //Home route:
        app.get('/', async (req: Request, res: Response) => {
            res.status(200).send("This is working!");
        }),
    // Item routes
    app.get('/items', async (req: Request, res: Response) => {
        const result = await items.getAllItems();
        res.status(result.status).send(result.data || result.message);
    }),
    app.post('/items', async (req: Request, res: Response) => {
        const { name, price } = req.body;
        const result = await items.addItem(name, price);
        res.status(result.status).send(result.message);
    }),
    app.get('/items/:id', async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await items.getItemById(id);
        res.status(result.status).send(result.data || result.message);
    }),
    app.put('/items/:id', async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string)
        const { name, price } = req.body;
        const result = await items.updateItemById(id, name, price);
        res.status(result.status).send(result.message);
    }),
    app.delete('/items/:id', async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string)
        const result = await items.deleteItemById(id);
        res.status(result.status).send(result.message);
    }),
    // User routes
    app.get('/users', async (req: Request, res: Response) => {
        const result = await users.getAllUsers();
        res.status(result.status).send(result.data || result.message);
    }),
    
    app.post('/users', async (req: Request, res: Response) => {
        const { username } = req.body;
        const result = await users.addUser(username);
        res.status(result.status).send(result.message);
    }),
    
    app.get('/users/:id', async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string)
        const result = await users.getUserById(id);
        res.status(result.status).send(result.data || result.message);
    }),
    
    app.put('/users/:id', async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string)
        const { username } = req.body;
        const result = await users.updateUserById(id, username);
        res.status(result.status).send(result.message);
    }),
    
    app.delete('/users/:id', async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string)
        const result = await users.deleteUserById(id);
        res.status(result.status).send(result.message);
    })
};
/* 
    // Carts routes
    app.get('/carts', async (req: Request, res: Response) => {
        const result = await carts.getAllCarts();
        res.status(result.status).send(result.data || result.message);
    });

    app.post('/carts', async (req: Request, res: Response) => {
        const { name, userid } = req.body;
        const result = await carts.addCart(name, userid);
        res.status(result.status).send(result.message);
    });

    app.delete('/carts/user/:userid', async (req: Request, res: Response) => {
        const { userid } = req.params;
        const result = await carts.deleteCartsByUserId(userid);
        res.status(result.status).send(result.message);
    });

    app.get('/carts/:cartid', async (req: Request, res: Response) => {
        const { cartid } = req.params;
        const result = await carts.getCartById(cartid);
        res.status(result.status).send(result.data || result.message);
    });

    app.delete('/carts/:cartid', async (req: Request, res: Response) => {
        const { cartid } = req.params;
        const result = await carts.deleteCartById(cartid);
        res.status(result.status).send(result.message);
    });

    app.post('/carts/:cartid', async (req: Request, res: Response) => {
        const { cartid } = req.params;
        const { action, itemid, amount } = req.body;

        let result;
        switch (action) {
            case "add":
                result = await carts.addItemToCart(cartid, itemid, amount);
                break;
            case "remove":
                result = await carts.removeItemFromCart(cartid, itemid, amount);
                break;
            case "clear":
                result = await carts.clearCart(cartid);
                break;
            default:
                res.status(400).send('Invalid action supplied');
                return;
        }
        res.status(result.status).send(result.message);
    }); */
