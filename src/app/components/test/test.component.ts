// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
// import { Cart } from 'src/app/common/Cart';
// import { CartDetail } from 'src/app/common/CartDetail';
// import { ChatMessage } from 'src/app/common/ChatMessage';
// import { District } from 'src/app/common/District';
// import { Notification } from 'src/app/common/Notification';
// import { Order } from 'src/app/common/Order';
// import { Province } from 'src/app/common/Province';
// import { Ward } from 'src/app/common/Ward';
// import { CartService } from 'src/app/services/cart.service';
// import { NotificationService } from 'src/app/services/notification.service';
// import { OrderService } from 'src/app/services/order.service';
// import { SessionService } from 'src/app/services/session.service';
// import { WebSocketService } from 'src/app/services/web-socket.service';
// import Swal from 'sweetalert2';
// import { CheckoutComponent } from '../checkout/checkout.component';
// @Component({
//   selector: 'app-test',
//   templateUrl: './test.component.html',
//   styleUrls: ['./test.component.css']
// })
// export class TestComponent implements OnInit {

//   cart!: Cart;
//   postForm: FormGroup;

//   cartDetail!: CartDetail;
//   cartDetails!: CartDetail[];

//   discount!: number;
//   amount!: number;
//   amountReal!: number;

//   provinces!: Province[];
  
//   districts!: District[];
//   wards!: Ward[];

//   province!: Province;
//   district!: District;
//   ward!: Ward;

//   amountPaypal !:number;
//   provinceCode!: number;
//   districtCode!: number;
//   wardCode!: number;

//   constructor(
//     private cartService: CartService,
//     private toastr: ToastrService,
//     private sessionService: SessionService,
//     private orderService: OrderService,
//     private webSocketService: WebSocketService,
//     private route: ActivatedRoute, private router: Router,
//     private notificationService: NotificationService,
//     ) {
//       this.postForm = new FormGroup({
//         'phone': new FormControl(null, [Validators.required, Validators.pattern('(0)[0-9]{9}')]),
//         'province': new FormControl(0, [Validators.required, Validators.min(1)]),
//         'district': new FormControl(0, [Validators.required, Validators.min(1)]),
//         'ward': new FormControl(0, [Validators.required, Validators.min(1)]),
//         'number': new FormControl('', Validators.required),
//       })
//   }

//   ngOnInit(): void {
//     this.webSocketService.openWebSocket();
//     this.router.events.subscribe((evt) => {
//       if (!(evt instanceof NavigationEnd)) {
//         return;
//       }
//       window.scrollTo(0, 0)
//     });
//   // Xử lý phản hồi thanh toán từ VNPay
//   this.route.queryParams.subscribe(params => {
//     debugger;
//     if (params['vnp_ResponseCode'] === '00') {
//       // Phản hồi từ VNPay là thành công
//       this.checkOut(); // Thực hiện hàm checkOut mà không cần xác nhận lại
//     } else {
//       console.error('Thanh toán không thành công hoặc bị hủy');
//       // Xử lý các trường hợp khác
//     }
//   });

//   }

// checkOut() {
//   if (this.postForm.valid) {
//     Swal.fire({
//       title: 'Bạn có muốn đặt đơn hàng này?',
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       cancelButtonText: 'Không',
//       confirmButtonText: 'Đặt'
//     }).then((result) => {
//       let email = this.sessionService.getUser();
//       this.cartService.getCart(email).subscribe(data => {
//         this.cart = data as Cart;
//         this.cart.address = this.postForm.value.number + ', ' + this.ward.name + ', ' + this.district.name + ', ' + this.province.name;
//         this.cart.phone = this.postForm.value.phone;
//         this.cartService.updateCart(email, this.cart).subscribe(data => {
//           this.cart = data as Cart;

//           this.orderService.post(email, this.cart).subscribe(data => {
//             let order: Order = data as Order;
          
//             // Kiểm tra nếu order tồn tại và billid không phải là null hoặc undefined
//             if (order && order.billid !== null && order.billid !== undefined) {
//               this.sendMessage(order.billid);
//               Swal.fire(
//                 'Thành công!',
//                 'Chúc mừng bạn đã đặt hàng thành công.',
//                 'success'
//               );
//               this.router.navigate(['/cart']);
//             } else {
//               console.error('Lỗi: Thuộc tính billid không hợp lệ trong đối tượng Order.');
//               // Xử lý trường hợp khi billid không hợp lệ
//             }
//           }, error => {
//             console.error('Lỗi khi gửi đơn hàng:', error);
//             this.toastr.error('Lỗi server', 'Hệ thống');
//           });

          
//         }, error => {
//           this.toastr.error('Lỗi server', 'Hệ thống');
//         })
//       }, error => {
//         this.toastr.error('Lỗi server', 'Hệ thống');
//       })
//     })

//   } else {
//     this.toastr.error('Hãy nhập đầy đủ thông tin', 'Hệ thống');
//   }
// }


//   sendMessage(id:number) {
//     let chatMessage = new ChatMessage(this.cart.user.name, ' đã đặt một đơn hàng');
//     this.notificationService.post(new Notification(0, this.cart.user.name + ' đã đặt một đơn hàng ('+id+')')).subscribe(data => {
//       this.webSocketService.sendMessage(chatMessage);
//     })
//   }


// }
