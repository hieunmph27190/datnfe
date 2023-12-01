import { Cart } from "./Cart";
import { ProductDetail } from "./ProductDetail";

export class CartDetail {
    'cart_detail_id': number;  // long trong Java được xử lý như number trong TypeScript
    'quantity': number;      // int trong Java cũng được xử lý như number trong TypeScript
    'price': number;         // Double trong Java được xử lý như number trong TypeScript
    'productdetail': ProductDetail; // Giả sử ProductDetail là một class khác bạn đã định nghĩa
    'cart': Cart;            // Giả sử Cart là một class khác bạn đã định nghĩa

}
