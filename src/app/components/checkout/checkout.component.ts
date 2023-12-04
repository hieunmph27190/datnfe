// import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/common/Cart';
import { CartDetail } from 'src/app/common/CartDetail';
import { ChatMessage } from 'src/app/common/ChatMessage';
import { District } from 'src/app/common/District';
import { Notification } from 'src/app/common/Notification';
import { Order } from 'src/app/common/Order';
import { Province } from 'src/app/common/Province';
import { Ward } from 'src/app/common/Ward';
import { PaymentService } from 'src/app/services/PaymentService';
import { CartService } from 'src/app/services/cart.service';
import { NotificationService } from 'src/app/services/notification.service';
import { OrderService } from 'src/app/services/order.service';
import { ProvinceService } from 'src/app/services/province.service';
import { SessionService } from 'src/app/services/session.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import Swal from 'sweetalert2';
import {  OnInit } from '@angular/core';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { SellOnProductRequest } from 'src/app/dto/SellOnProductRequest';
import { Customer } from 'src/app/common/Customer';
import { AuthService } from 'src/app/services/auth.service';
import { SellOnRequest } from 'src/app/dto/SellOnRequest';





@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cart!: Cart;
  cartDetail!: CartDetail;
  cartDetails!: CartDetail[];
  productsChecked!: SellOnProductRequest[];
  totalPrice:number = 0;
  
  postForm!: FormGroup;
  customer: Customer={} as Customer;
  provinces!: Province[];
  
  districts!: District[];
  wards!: Ward[];

  province!: Province;
  district!: District;
  ward!: Ward;

  amountPaypal!:number;
  provinceCode!: number;
  districtCode!: number;
  wardCode!: number;
  public payPalConfig ? : IPayPalConfig;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private dataService: DataService,
    private sessionService: SessionService,
    private orderService: OrderService,
    private location: ProvinceService,
    private webSocketService: WebSocketService,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    ) {
    this.postForm = new FormGroup({
      'phoneNumber': new FormControl(this.customer.phoneNumber,[Validators.required, Validators.pattern('(0)[0-9]{9}')]),
      'city': new FormControl(0, [Validators.required, Validators.min(1)]),
      'district': new FormControl(0, [Validators.required, Validators.min(1)]),
      'ward': new FormControl(0, [Validators.required, Validators.min(1)]),
      'address': new FormControl('', Validators.required),
      'note': new FormControl(''),
    })
    
   }

  ngOnInit(): void {
    // this.checkOutPaypal();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });

    this.dataService.data$.subscribe(data => {
      this.productsChecked = data ;
      if(this.productsChecked==null||this.productsChecked?.length<=0){
         this.router.navigate(['/home']);
         return;
      }else{
        this.cartService.getTotalPrice(this.productsChecked).subscribe((data) => {
         this.totalPrice =data as number;
      });
      }

    });

    this.authService.profile().subscribe(data => {
      this.customer = data as Customer;
      this.postForm = new FormGroup({
        'phoneNumber': new FormControl(this.customer.phoneNumber,[Validators.required, Validators.pattern('(0)[0-9]{9}')]),
        'city': new FormControl(0, [Validators.required, Validators.min(1)]),
        'district': new FormControl(0, [Validators.required, Validators.min(1)]),
        'ward': new FormControl(0, [Validators.required, Validators.min(1)]),
        'address': new FormControl('', Validators.required),
        'note': new FormControl(''),
     })

    },error => {
        this.toastr.error('Lỗi lấy thông tin đăng nhập!', 'Hệ thống')
    });

     
    

    this.amountPaypal = 0;

    // this.getAllItem();
    this.getProvinces();

  
  }


checkOut() {
  if (this.postForm.valid) {
    Swal.fire({
      title: 'Bạn có muốn đặt đơn hàng này?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Không',
      confirmButtonText: 'Đặt'
    }).then((result) => {
      if(result.isConfirmed){
          let dataForm = this.postForm.value;
          const newProductsChecked = this.productsChecked.map(item => {
            let { productDetail, ...rest } = item;
            return rest;
          });
          let sellOnRequest = new SellOnRequest(newProductsChecked);
          sellOnRequest.setPhoneNumber(dataForm.phoneNumber);
          sellOnRequest.setAddress(dataForm.address+" "+dataForm.ward+" "+dataForm.district+" "+dataForm.city);
          sellOnRequest.setNote(dataForm.note);
          this.orderService.postBill(sellOnRequest).subscribe((result) => {
              this.toastr.success('Đặt hàng thành công : '+result , 'Hệ thống');
          },error =>{
              if(error.status==200){
                this.toastr.success('Đặt hàng thành công :  '+error.text, 'Hệ thống');
              }else{
                this.toastr.error('Lỗi '+error.error, 'Hệ thống');
              }
          })
      }

    })

  } else {
    this.toastr.error('Hãy nhập đầy đủ thông tin', 'Hệ thống');
  }
}




  // getAllItem() {
  //   let email = this.sessionService.getUser();
  //   this.cartService.getCart(email).subscribe(data => {
  //     this.cart = data as Cart;
  //     this.postForm = new FormGroup({
  //       'phone': new FormControl(this.cart.phone, [Validators.required, Validators.pattern('(0)[0-9]{9}')]),
  //       'province': new FormControl(0, [Validators.required, Validators.min(1)]),
  //       'district': new FormControl(0, [Validators.required, Validators.min(1)]),
  //       'ward': new FormControl(0, [Validators.required, Validators.min(1)]),
  //       'number': new FormControl('', Validators.required),
  //     })
  //     this.cartService.getAllDetail(this.cart.cart_id).subscribe(data => {
  //       this.cartDetails = data as CartDetail[];
  //       this.cartService.setLength(this.cartDetails.length);
  //       if (this.cartDetails.length == 0) {
  //         this.router.navigate(['/']);
  //         this.toastr.info('Hãy chọn một vài sản phẩm rồi tiến hành thanh toán', 'Hệ thống');
  //       }
  //       this.cartDetails.forEach(item => {
  //         this.amountReal += item.productdetail.price * item.quantity;
  //         this.amountReal1 = item.price;
  //         this.amount += item.price;
  //       })
  //       this.discount = this.amount - this.amountReal;

  //       this.amountPaypal = (this.amount/22727.5);
  //     });
  //   });
  // }


  // sendMessage(id:number) {
  //   let chatMessage = new ChatMessage(this.cart.user.name, ' đã đặt một đơn hàng');
  //   this.notificationService.post(new Notification(0, this.cart.user.name + ' đã đặt một đơn hàng ('+id+')')).subscribe(data => {
  //     this.webSocketService.sendMessage(chatMessage);
  //   })
  // }


  getProvinces() {
    this.location.getAllProvinces().subscribe(data => {
      this.provinces = data as Province[];
    })
  }

  getDistricts() {
    this.location.getDistricts(this.provinceCode).subscribe(data => {
      this.province = data as Province;
      this.districts = this.province.districts;
    })
  }

  getWards() {
    this.location.getWards(this.districtCode).subscribe(data => {
      this.district = data as District;
      this.wards = this.district.wards;
    })
  }

  getWard() {
    this.location.getWard(this.wardCode).subscribe(data => {
      this.ward = data as Ward;
    })
  }

 setProvinceCode(event: Event) {
  let selectedOptionData = ((event.target  as HTMLSelectElement).selectedOptions[0] as HTMLOptionElement).getAttribute("data");
  this.provinceCode = Number(selectedOptionData);
  this.getDistricts();
}

  setDistrictCode(event: Event) {
    let selectedOptionData = ((event.target  as HTMLSelectElement).selectedOptions[0] as HTMLOptionElement).getAttribute("data");
    this.districtCode = Number(selectedOptionData);
    this.getWards();
  }

  setWardCode(event: Event) {
    let selectedOptionData = ((event.target  as HTMLSelectElement).selectedOptions[0] as HTMLOptionElement).getAttribute("data");
    this.wardCode = Number(selectedOptionData);
    this.getWard();
  }

 

// private checkOutPaypal(): void {
//   this.payPalConfig = {
//     currency: 'USD',
//     clientId: 'Af5ZEdGAlk3_OOp29nWn8_g717UNbdcbpiPIZOZgSH4Gdneqm_y_KVFiHgrIsKM0a2dhNBfFK8TIuoOG',
    
//     createOrderOnClient: (data) => <ICreateOrderRequest > {
//       intent: 'CAPTURE',
//       purchase_units: [{
//         amount: {
//           currency_code: 'USD',
//           value: this.amountPaypal.toFixed(2), // Tổng giá trị phải thanh toán
//         },
        
//       }]
//   },
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
//       // this.checkOut();
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
//   }
}
    
//   };
  
// }


