import { ProductDetail } from "../common/ProductDetail";


export class SellOnProductRequest {
    'id': string;  
    'quantity': number;
    'productDetail': ProductDetail;
     constructor(id: string,quantity: number ) {
        this['id'] = id;
        this['quantity'] = quantity;
      }
    setProductDetail(productDetail: ProductDetail){
       this['productDetail'] = productDetail;
    }
}
