import { Product } from "./Product";


export class Image {
    'id': string;     // UUID được xử lý như một chuỗi trong TypeScript
    'image': string;  // Blob trong Java có thể được thay thế bằng một chuỗi mã hóa Base64 hoặc URL
    'type': number;   // Integer trong Java được xử lý như number trong TypeScript
    'product': Product; // Giả sử Product là một class khác bạn đã định nghĩa

}