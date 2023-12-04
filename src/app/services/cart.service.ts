import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../common/Cart';
import { CartDetail } from '../common/CartDetail';
import { SellOnProductRequest } from '../dto/SellOnProductRequest';
import { SellOnRequest } from '../dto/SellOnRequest';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  urlCart = 'http://localhost:8080/api/cart';

  constructor(private httpClient: HttpClient) { }

  totalCartsItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  $data: Observable<number> = this.totalCartsItems.asObservable();


  setLength(total:number) {
    this.totalCartsItems.next(total);
  }

  getAllDetail() {
    return this.httpClient.get(this.urlCart+'/cart-details',{ withCredentials: true });
  }


  getOneDetail(detailId:number) {
    return this.httpClient.get(this.urlCart+'/'+detailId);
  }
  getTotalPrice(products:SellOnProductRequest[]) {
    return this.httpClient.post('http://localhost:8080/sellon/calculate-money',new SellOnRequest(products),{ withCredentials: true });
  }




  updateDetail(detail: CartDetail) {
    return this.httpClient.put(this.urlCart, detail);
  }


  deleteDetail(detailId:number) {
    return this.httpClient.delete(this.urlCart+'/'+detailId,{ withCredentials: true });
  }



  postDetail(productDetailID: string) {
    const params = new HttpParams().set('productDetailId', productDetailID);
  return this.httpClient.post(this.urlCart, params,{ withCredentials: true });
  }

}
