import { Color } from "./Color";
import { Product } from "./Product";
import { Size } from "./Size";

export class ProductDetail {
    'id': string;  // UUID được xử lý như một chuỗi
    'amount': number;  // Long trong Java được xử lý như number trong TypeScript
    'createDate': Date; // Timestamp được thay thế bằng Date
    'price': number;    // BigDecimal trong Java có thể được xử lý như một number hoặc string
    'type': number;
    'color': Color;     // Giả sử Color là một class khác bạn đã định nghĩa
    'product': Product; // Giả sử Product là một class khác bạn đã định nghĩa
    'size': Size;
    "quantity":number
  }
