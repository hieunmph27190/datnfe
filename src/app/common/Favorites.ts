import { Customer } from "./Customer";
import { productdetail } from "./productdetail";

export class Favorites {
    'favoriteId': number;
    'user': Customer;
     'productdetail': productdetail;


    constructor(favoriteId: number, user: Customer, productdetail: productdetail) {
        this.favoriteId = favoriteId;
        this.productdetail = productdetail;
        this.user = user;
    }

}
