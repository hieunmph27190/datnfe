import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ChatMessage } from 'src/app/common/ChatMessage';
import { Customer } from 'src/app/common/Customer';
import { Notification } from 'src/app/common/Notification';
import { Order } from 'src/app/common/Order';
import { BillReponse } from 'src/app/dto/BillReponse';
import { DataTableReponse } from 'src/app/dto/DataTableReponse';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { NotificationService } from 'src/app/services/notification.service';
import { OrderService } from 'src/app/services/order.service';
import { SessionService } from 'src/app/services/session.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {

  customer!: Customer;
  orders!: Order[];

  dataTableReponse!:DataTableReponse<BillReponse>;

  page: number = 1;
  size: number = 10;

  done!: number;

  constructor(
    private customerService: CustomerService,
    private toastr: ToastrService,
    private sessionService: SessionService,
    private router: Router,
    private orderService: OrderService,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService,
    private authService: AuthService,
   ) {
  }


  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
     this.getBillReponses();
  }

   calculateMinutesAgo(createdAt: Date): number {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const timeDifference = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60));
    return 15-timeDifference;
  }


   getBillReponses() {
     this.orderService.getsellon().subscribe((data: any) => {
        this.dataTableReponse = data as DataTableReponse<BillReponse>;
      }
    );
  }

    thanhToanVNPay(billId:string) {
     this.orderService.vnpay(billId).subscribe((data: any) => {
        window.location.href = (data as any).message;
      },error =>{
        this.toastr.error(error.error, 'Hệ thống');
      }
    );
  }

  huyBill(billId:string,type:number) {
    if(type!=1&&type!=-2) {
      return;
    }
    Swal.fire({
      title: 'Bạn có muốn huỷ đơn hàng này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Không',
      confirmButtonText: 'Huỷ'
    }).then((result) => {
      if (result.isConfirmed) {
           this.orderService.cancelBill(billId).subscribe(data => {
          this.toastr.success((data as any).message, 'Hệ thống');
          this.getBillReponses();
        }, error => {
          this.toastr.error(error.error, 'Hệ thống');
        })
      }
    })

  }
  nhanHang(billId:string,type:number) {
    if(type!=5) {
      return;
    }
    Swal.fire({
      title: 'Bạn đã nhận đơn hàng này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'Không',
      confirmButtonText: 'Đã nhận'
    }).then((result) => {
      if (result.isConfirmed) {
           this.orderService.nhanHang(billId).subscribe(data => {
           this.toastr.success((data as any).message, 'Hệ thống');
          this.getBillReponses();
        }, error => {
          this.toastr.error(error.error, 'Hệ thống');
        })
      }
    })

  }



  // sendMessage(id:number) {
  //   let chatMessage = new ChatMessage(this.customer.name, ' đã huỷ một đơn hàng');
  //   this.notificationService.post(new Notification(0, this.customer.name + ' đã huỷ một đơn hàng ('+id+')')).subscribe(data => {
  //     this.webSocketService.sendMessage(chatMessage);
  //   })
  // }

  finish() {
    this.ngOnInit();
  }

}
