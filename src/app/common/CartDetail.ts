import { Cart } from "./Cart";
import { Customer } from "./Customer";
import { ProductDetail } from "./ProductDetail";

export class CartDetail {
    'cartDetailId': number;  // long trong Java được xử lý như number trong TypeScript
    'productDetail': ProductDetail; // Giả sử ProductDetail là một class khác bạn đã định nghĩa
    'customer': Customer;            // Giả sử Cart là một class khác bạn đã định nghĩa

}
