import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart } from '../common/Cart';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SellOnRequest } from '../dto/SellOnRequest';

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


  postBill(bill: SellOnRequest) {
    return this.httpClient.post("http://localhost:8080/sellon",bill,{ withCredentials: true });
  }
  cancelBill(billId: string) {
    return this.httpClient.put("http://localhost:8080/bill/cancel-bill/"+billId,{},{ withCredentials: true });
  }
  nhanHang(billId: string) {
    return this.httpClient.put("http://localhost:8080/bill/nhan-hang/"+billId,{},{ withCredentials: true });
  }


  tinhTienShip(params?:any) {
    let httpParams = new HttpParams();
    if (params) {
        // Append each parameter to the HttpParams object
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                if( params[key]){
                    httpParams = httpParams.append(key, params[key]);
                }
               
            }
        }
    }

    return this.httpClient.get("http://localhost:8080/public/shipfee",{ params: httpParams });
  }


  getTotalPriceByBillId(billID:string) {
   return this.httpClient.get("http://localhost:8080/sellon/calculate-money/"+billID,{ withCredentials: true });
  }

  getsellon() {
   return this.httpClient.get("http://localhost:8080/bill/sellon?length=999999",{ withCredentials: true });
  }

  vnpay(billID:string) {
   return this.httpClient.get("http://localhost:8080/api/vnpay/"+billID,{ withCredentials: true });
  }

  getBilldetail(id:string) {
   return this.httpClient.get("http://localhost:8080/bill-detail?billId="+id,{ withCredentials: true });
  }


  get(email:string) {
   return this.httpClient.get(this.url+'/user/'+email);
  }

  getById(billId:string) {
    return this.httpClient.get("http://localhost:8080/bill"+'/'+billId,{ withCredentials: true });
  }

  getByOrder(id:number) {
    return this.httpClient.get(this.urlOrderDetail+'/order/'+id);
  }

  cancel(id: number) {
    return this.httpClient.get(this.url+'/cancel/'+id);
  }

}
