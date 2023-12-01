// // import { Component, OnInit, ViewChild } from '@angular/core';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
// import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
// import { ToastrService } from 'ngx-toastr';
// import { Cart } from 'src/app/common/Cart';
// import { CartDetail } from 'src/app/common/CartDetail';
// import { ChatMessage } from 'src/app/common/ChatMessage';
// import { District } from 'src/app/common/District';
// import { Notification } from 'src/app/common/Notification';
// import { Order } from 'src/app/common/Order';
// import { Province } from 'src/app/common/Province';
// import { Ward } from 'src/app/common/Ward';
// import { PaymentService } from 'src/app/services/PaymentService';
// import { CartService } from 'src/app/services/cart.service';
// import { NotificationService } from 'src/app/services/notification.service';
// import { OrderService } from 'src/app/services/order.service';
// import { ProvinceService } from 'src/app/services/province.service';
// import { SessionService } from 'src/app/services/session.service';
// import { WebSocketService } from 'src/app/services/web-socket.service';
// import Swal from 'sweetalert2';
// import {  OnInit } from '@angular/core';
// import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';





// @Component({
//   selector: 'app-checkout',
//   templateUrl: './checkout.component.html',
//   styleUrls: ['./checkout.component.css']
// })
// export class CheckoutComponent implements OnInit {

//   cart!: Cart;
//   cartDetail!: CartDetail;

//   cartDetails!: CartDetail[];

//   discount!: number;
//   amount!: number;
//   amountReal!: number;
//   amountReal1!: number;

//   postForm: FormGroup;

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
//   public payPalConfig ? : IPayPalConfig;

//   constructor(
//     private cartService: CartService,
//     private toastr: ToastrService,
//     private router: Router,
//     private sessionService: SessionService,
//     private orderService: OrderService,
//     private location: ProvinceService,
//     private webSocketService: WebSocketService,
//     private paymentService: PaymentService,
//     private route: ActivatedRoute,
//     private notificationService: NotificationService,
//     ) {

//     this.postForm = new FormGroup({
//       'phone': new FormControl(null, [Validators.required, Validators.pattern('(0)[0-9]{9}')]),
//       'province': new FormControl(0, [Validators.required, Validators.min(1)]),
//       'district': new FormControl(0, [Validators.required, Validators.min(1)]),
//       'ward': new FormControl(0, [Validators.required, Validators.min(1)]),
//       'number': new FormControl('', Validators.required),
//     })

//   }

//   ngOnInit(): void {
//     this.checkOutPaypal();
//     // this.webSocketService.openWebSocket();
//     this.router.events.subscribe((evt) => {
//       if (!(evt instanceof NavigationEnd)) {
//         return;
//       }
//       window.scrollTo(0, 0)
//     });
//     this.discount = 0;
//     this.amount = 0;
//     this.amountPaypal = 0;
//     this.amountReal = 0;
//     this.amountReal1 = 0;
//     this.getAllItem();
//     this.getProvinces();

  
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




//   getAllItem() {
//     let email = this.sessionService.getUser();
//     this.cartService.getCart(email).subscribe(data => {
//       this.cart = data as Cart;
//       this.postForm = new FormGroup({
//         'phone': new FormControl(this.cart.phone, [Validators.required, Validators.pattern('(0)[0-9]{9}')]),
//         'province': new FormControl(0, [Validators.required, Validators.min(1)]),
//         'district': new FormControl(0, [Validators.required, Validators.min(1)]),
//         'ward': new FormControl(0, [Validators.required, Validators.min(1)]),
//         'number': new FormControl('', Validators.required),
//       })
//       this.cartService.getAllDetail(this.cart.cart_id).subscribe(data => {
//         this.cartDetails = data as CartDetail[];
//         this.cartService.setLength(this.cartDetails.length);
//         if (this.cartDetails.length == 0) {
//           this.router.navigate(['/']);
//           this.toastr.info('Hãy chọn một vài sản phẩm rồi tiến hành thanh toán', 'Hệ thống');
//         }
//         this.cartDetails.forEach(item => {
//           this.amountReal += item.productdetail.price * item.quantity;
//           this.amountReal1 = item.price;
//           this.amount += item.price;
//         })
//         this.discount = this.amount - this.amountReal;

//         this.amountPaypal = (this.amount/22727.5);
//       });
//     });
//   }


//   sendMessage(id:number) {
//     let chatMessage = new ChatMessage(this.cart.user.name, ' đã đặt một đơn hàng');
//     this.notificationService.post(new Notification(0, this.cart.user.name + ' đã đặt một đơn hàng ('+id+')')).subscribe(data => {
//       this.webSocketService.sendMessage(chatMessage);
//     })
//   }


//   getProvinces() {
//     this.location.getAllProvinces().subscribe(data => {
//       this.provinces = data as Province[];
//     })
//   }

//   getDistricts() {
//     this.location.getDistricts(this.provinceCode).subscribe(data => {
//       this.province = data as Province;
//       this.districts = this.province.districts;
//     })
//   }

//   getWards() {
//     this.location.getWards(this.districtCode).subscribe(data => {
//       this.district = data as District;
//       this.wards = this.district.wards;
//     })
//   }

//   getWard() {
//     this.location.getWard(this.wardCode).subscribe(data => {
//       this.ward = data as Ward;
//     })
//   }

//   setProvinceCode(code: any) {
//     this.provinceCode = code.value;
//     this.getDistricts();
//   }

//   setDistrictCode(code: any) {
//     this.districtCode = code.value;
//     this.getWards();
//   }

//   setWardCode(code: any) {
//     this.wardCode = code.value;
//     this.getWard();
//   }

 

// private checkOutPaypal(): void {
//   this.payPalConfig = {
//     currency: 'USD',
//     clientId: 'Af5ZEdGAlk3_OOp29nWn8_g717UNbdcbpiPIZOZgSH4Gdneqm_y_KVFiHgrIsKM0a2dhNBfFK8TIuoOG',
    
//     createOrderOnClient: (data) => ({
//       intent: 'CAPTURE',
//       purchase_units: [{
//         amount: {
//           currency_code: 'USD',
//           value: this.amountPaypal.toFixed(2), // Tổng giá trị phải thanh toán
//         },
//         items: this.cartDetails.map(item => {
//           // Đảm bảo rằng giá trị quantity là một số nguyên
//           const quantityAsInteger = parseInt(item.quantity.toString(), 10);
        
//           // Kiểm tra nếu quantity không phải là số hoặc nhỏ hơn 1, thì đặt nó thành 1
//           const validQuantity = Number.isNaN(quantityAsInteger) || quantityAsInteger < 1 ? 1 : quantityAsInteger;
        
//           return {
//             name: item.productdetail.product.name,
//             unit_amount: {
//               currency_code: 'USD',
//               value: (validQuantity !== 0) ? ((item.quantity * item.price) / 22727.5).toFixed(2) : '0.00',
//             },
//             quantity: validQuantity.toString(), // Sử dụng quantity đã được kiểm tra và đảm bảo là hợp lệ
//           };
//         }),
        
//       }],
//     }),
    

//     advanced: {
//       commit: 'true',
//     },
//     style: {
//       label: 'paypal',
//       layout: 'vertical',
//       color: 'blue',
//       size: 'small',
//       shape: 'rect',
//     },
//     onApprove: (data, actions) => {
//       // Xử lý sau khi giao dịch được chấp thuận
//     },
//     onClientAuthorization: (data) => {
//       // Xử lý khi giao dịch hoàn thành
//       this.checkOut();
//     },
//     onCancel: (data, actions) => {
//       // Xử lý khi người dùng hủy giao dịch
//     },
//     onError: err => {
//       // Xử lý khi có lỗi xảy ra
//     },
//     onClick: (data, actions) => {
//       // Xử lý khi nút PayPal được click
//     },
    
//   };
  
// }

// }
