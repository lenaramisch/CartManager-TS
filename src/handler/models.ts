export class ItemDTO {
        constructor(
            public id: number,
            public name: string,
            public price: number
        ) {}
}
export class UserDTO {
    constructor(
        public id: number,
        public username: string
    ) {}
}

export class CartDTO {
    constructor (
        public id: number, 
        public userid: number, 
        public name: string,
        public items?: ItemInCartDTO[],
        public cartValue?: number
    ) {}
}

export class ItemInCartDTO {
    constructor (
        public item_id: number,
        public amount: number
    ) {}
}
