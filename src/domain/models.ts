export class ItemDomain {
    constructor(public id: number, public price: number, public name: string, public created_at: string) {}
}
export class UserDomain {
    constructor(public id: number, public username: string) {}
}
