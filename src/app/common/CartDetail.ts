import { Cart } from "./Cart";
import { productdetail } from "./productdetail";


export class CartDetail {
    'cart_detail_id': number;
    'quantity': number;
    'price': number;
    'productdetail': productdetail;
    'cart': Cart;

    constructor(id: number, quantity: number, price: number, productdetail: productdetail, cart: Cart) {
        this.cart_detail_id = id;
        this.quantity = quantity;
        this.price = price;
        this.productdetail = productdetail;
        this.cart = cart;
    }
}
