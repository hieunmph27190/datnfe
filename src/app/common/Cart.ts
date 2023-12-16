import { Customer } from "./Customer";

export class Cart {
    'cart_id': number;
    'amount': number;
    'address': string;
    'phone': string;
    'user': Customer;

    constructor(id:number) {
        this.cart_id = id;
    }
}
