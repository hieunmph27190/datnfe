import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentService { 

  private payUrl = 'http://localhost:8080/api/pay'; // Thay đổi URL theo địa chỉ backend của bạn

  constructor(private httpClient: HttpClient) { }


  getVNPayPaymentUrl() {
    // Gọi API để lấy URL thanh toán VNPay
      return this.httpClient.get<string>(this.payUrl, { responseType: 'text' as 'json' });
    }
  



    // getVNPayPaymentUrl(): Observable<string> {
    //   return this.httpClient.get<string>(this.payUrl);
    // }









}
