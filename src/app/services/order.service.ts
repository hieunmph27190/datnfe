import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart } from '../common/Cart';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  url = "http://localhost:8080/api/orders";

  urlOrderDetail = "http://localhost:8080/api/orderDetail";


  constructor(private httpClient:HttpClient){ }


  // post(email: string, cart: Cart) {
  //   return this.httpClient.post(this.url + '/' + email, cart).pipe(
  //     tap((data) => {
  //       console.log('Dữ liệu trả về từ API:', data);
  //       if (data === null) {
  //         console.warn('API trả về giá trị null.');
  //       } else {
  //         // Thực hiện các thao tác với dữ liệu ở đây nếu cần
  //       }
  //     }),
  //     catchError((error) => {
  //       console.error('Lỗi khi gửi yêu cầu POST:', error);
  //       return throwError(error);
  //     })
  //   );
  // }
  post(email: string, cart: Cart) {
    return this.httpClient.post(this.url+'/'+email, cart);
  }

  

  get(email:string) {
   return this.httpClient.get(this.url+'/user/'+email);
  }

  getById(id:number) {
    return this.httpClient.get(this.url+'/'+id);
  }

  getByOrder(id:number) {
    return this.httpClient.get(this.urlOrderDetail+'/order/'+id);
  }
  
  cancel(id: number) {
    return this.httpClient.get(this.url+'/cancel/'+id);
  }
  
}
