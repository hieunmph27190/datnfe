import { Brand } from "./Brand";
import { Category } from "./Category";
import { Image } from "./Image";
import { Sole } from "./Sole";



export class Product {
    'id': string;  // UUID được xử lý như một chuỗi
    'code': string;
    'name': string;
    'type': number;
    'description': string;
    'createDate': Date; // Timestamp được thay thế bằng Date
    'category': Category; // Giả sử Category là một class khác bạn đã định nghĩa
    'sole': Sole;        // Giả sử Sole là một class khác bạn đã định nghĩa
    'brand': Brand;      // Giả sử Brand là một class khác bạn đã định nghĩa
    'images': Image[];   // Mảng các Image, giả sử Image là một class khác

}
