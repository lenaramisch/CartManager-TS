export class ItemDB {
    constructor(
        public id: number, 
        public price: number, 
        public name: string, 
        public created_at: string
    ) {}
}

export class UserDB {
    constructor(
        public id: number, 
        public username: string, 
        public created_at: string
    ) {}
}

export class CartDB {
    constructor(
        public id: number, 
        public user_id: number,
        public name: string, 
        public created_at: string
    ) {}
}

export class ItemInCartDB {
    constructor (
        public id: number,
        public cart_id: number,
        public item_id: number,
        public amount: number,
        public created_at: string
    ) {}
}
