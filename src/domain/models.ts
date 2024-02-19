export class ItemDomain {
    constructor(
        public id: number, 
        public price: number, 
        public name: string
    ) {}
}

export class UserDomain {
    constructor(
        public id: number, 
        public username: string
    ) {}
}

export class ItemInCartDomain {
    constructor (
        public item: ItemDomain,
        public amount: number
    ) {}
}

export class CartDomain {
    constructor(
        public id: number, 
        public userid: number, 
        public name: string, 
        public cartItems?: ItemInCartDomain[]
    ) {}
}
