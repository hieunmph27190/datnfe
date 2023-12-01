import { Customer } from "./Customer";

export class Cart {
    'cart_id': number; // long trong Java được xử lý như number trong TypeScript
    'amount': number; // int trong Java cũng được xử lý như number trong TypeScript
    'address': string;
    'phone': number;
    'customer': Customer; // Giả sử Customer là một class khác bạn đã định nghĩa

    constructor(cart_id: number, amount: number, address: string, phone: number, customer: Customer) {
        this['cart_id'] = cart_id;
        this['amount'] = amount;
        this['address'] = address;
        this['phone'] = phone;
        this['customer'] = customer;
    }
}
