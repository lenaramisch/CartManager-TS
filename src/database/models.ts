export class ItemDB {
    constructor(public id: number, public price: number, public name: string, public created_at: string) {}
}
export class UserDB {
    constructor(public id: number, public username: string, public created_at: string) {}
}
