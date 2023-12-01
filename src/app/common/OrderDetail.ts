import { Order } from "./Order";
import { ProductDetail } from "./ProductDetail";

export class OrderDetail {
    'id': string;          // UUID được xử lý như một chuỗi trong TypeScript
    'price': number;       // BigDecimal trong Java có thể được xử lý như một number hoặc string
    'quantity': number;    // Integer trong Java được xử lý như number trong TypeScript
    'type': number;
    'bill': Order;          // Giả sử Bill là một class khác bạn đã định nghĩa
    'productDetail': ProductDetail; // Giả sử ProductDetail là một class khác bạn đã định nghĩa
}
