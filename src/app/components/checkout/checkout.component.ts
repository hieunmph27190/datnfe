// import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/common/Cart';
import { CartDetail } from 'src/app/common/CartDetail';
import { Ward } from 'src/app/common/Ward';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { ProvinceService } from 'src/app/services/province.service';
import Swal from 'sweetalert2';
import {  OnInit } from '@angular/core';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { SellOnProductRequest } from 'src/app/dto/SellOnProductRequest';
import { Customer } from 'src/app/common/Customer';
import { AuthService } from 'src/app/services/auth.service';
import { SellOnRequest } from 'src/app/dto/SellOnRequest';
import { District } from '../../common/District';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('citySelect') citySelect!: ElementRef;
  @ViewChild('districtSelect') districtSelect!: ElementRef;
  @ViewChild('wardSelect') wardSelect!: ElementRef;
  cart!: Cart;
  cartDetail!: CartDetail;
  cartDetails!: CartDetail[];
  productsChecked!: SellOnProductRequest[];
  totalPrice:number = 0;
  shipFee:number = 0;

  postForm!: FormGroup;
  customer: Customer={} as Customer;

  provinces!: any[];

  districts!: any[];

  wards!: any[];

  province!: any[];
  district!: any[];

  ward!: Ward;

  amountPaypal!:number;
  provinceCode!: number;
  districtCode!: number;
  wardCode!: number;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private dataService: DataService,
    private orderService: OrderService,
    private location: ProvinceService,
    private route: ActivatedRoute,
    ) {

    this.postForm = new FormGroup({
      'phoneNumber': new FormControl(this.customer.phoneNumber,[Validators.required, Validators.pattern('(0)[0-9]{9}')]),
      'city': new FormControl("", [Validators.required, Validators.min(1)]),
      'district': new FormControl("", [Validators.required, Validators.min(1)]),
      'ward': new FormControl("", [Validators.required, Validators.min(1)]),
      'address': new FormControl('', Validators.required),
      'note': new FormControl(''),
      "paymentType":new FormControl(2)
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
         return;
      }else{
        this.cartService.getTotalPrice(this.productsChecked).subscribe((data) => {
         this.totalPrice =data as number;
      });
      }

    });

    this.getProfile();

    this.amountPaypal = 0;
    this.getProvinces1();



  }
   getTienShip() {
        let dataForm = this.postForm.value;
      if(dataForm.city==""||
        dataForm.district==""||
        dataForm.ward==""||this.productsChecked.length==0||this.totalPrice==0||this.totalPrice==null){
          return;
      }
      let quantity = 0;
      this.productsChecked.forEach((item)=>{
        quantity+=Number(item.quantity);
      });
      let data = {"tinh":dataForm.city,
      "huyen":dataForm.district,
      "xa":dataForm.ward,
      "quantity":quantity,
      "price":this.totalPrice
     }
      this.orderService.tinhTienShip(data).subscribe(datax=>{
         this.shipFee = (datax as any).data.total
      }, error=>{
        this.toastr.error('Server!', "Vui lòng nhập đủ địa chỉ");
      })
    }

  getProfile() {
    this.authService.profile().subscribe(data => {
        this.customer = data as Customer;
        this.postForm.setValue({
            'phoneNumber': this.customer.phoneNumber,
            'city': this.customer.city,
            'district': this.customer.district,
            'ward': this.customer.ward,
            'address': this.customer.address,
            'note':"",
            "paymentType":2
        });
        setTimeout(() => {
            let citySelectElement: HTMLSelectElement = this.citySelect.nativeElement;
           let citySelectedOptionData = (citySelectElement.selectedOptions[0] as HTMLOptionElement)?.getAttribute("data");
            this.provinceCode = Number(citySelectedOptionData);
           this.getDistricts1();
            this.postForm.setValue({
            'phoneNumber': this.customer.phoneNumber,
            'city': this.customer.city,
            'district': this.customer.district,
            'ward': this.customer.ward,
            'address': this.customer.address,
            'note':"",
            "paymentType":2
        });
         setTimeout(() => {
            let districtSelectElement: HTMLSelectElement = this.districtSelect.nativeElement;
                    let districtSelectOptionData = (districtSelectElement.selectedOptions[0] as HTMLOptionElement)?.getAttribute("data");
                    this.districtCode = Number(districtSelectOptionData);
                    this.getWards1();
                       this.postForm.setValue({
                          'phoneNumber': this.customer.phoneNumber,
                          'city': this.customer.city,
                          'district': this.customer.district,
                          'ward': this.customer.ward,
                          'address': this.customer.address,
                          'note':"",
                          "paymentType":2
                      });
                     setTimeout(() => {
                      this.getTienShip();
               }, 500);
         }, 500);
        }, 500);

      },error =>{
        this.toastr.error('!', 'Hệ thống');
      }
    );
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
          if(this.productsChecked==null||this.productsChecked.length<=0){
             this.toastr.error('Không thể đặt hàng khi không chọn sản phẩm !', 'Hệ thống');
             return;
          }
          let newProductsChecked = this.productsChecked.map(item => {
            let { productDetail, ...rest } = item;
            return rest;
          });
          let sellOnRequest = new SellOnRequest(newProductsChecked);
          sellOnRequest.setPhoneNumber(dataForm.phoneNumber);
          sellOnRequest.setAddress(dataForm.address+" "+dataForm.ward+" "+dataForm.district+" "+dataForm.city);
          sellOnRequest.setCity(dataForm.city);
          sellOnRequest.setDistrict(dataForm.district);
          sellOnRequest.setWard(dataForm.ward);
          sellOnRequest.setNote(dataForm.note);
          sellOnRequest.setPaymentType(dataForm.paymentType);
          this.orderService.postBill(sellOnRequest).subscribe((result) => {
              this.toastr.success('Đặt hàng thành công : '+(result as any).message , 'Hệ thống');
              if(dataForm.paymentType==2){
                this.orderService.vnpay((result as any).message).subscribe((data: any) => {
                    window.location.href = (data as any).message;
                },error =>{
                  this.toastr.error(error.error, 'Hệ thống');
                }
              );
              }else{
                window.location.href = "http://localhost:4200/bill";
              }
             

          },error =>{
              if(error.status==200){
                this.toastr.success('Đặt hàng thành công :  '+error.text, 'Hệ thống');
              }else{
                this.toastr.error(''+error.error, 'Hệ thống');
              }
          })
      }
    })
  } else {
    this.toastr.error('Hãy nhập đầy đủ thông tin', 'Hệ thống');
  }
}

  getProvinces1() {
    this.location.getAllProvinces1().subscribe(data => {
      this.provinces = (data as any).data;
    })
  }

  getDistricts1() {
    this.location.getDistricts1(this.provinceCode).subscribe(data => {
      this.province = (data as any).data;
       this.districts = this.province;
    })

  }

  getWards1() {
    this.location.getWards1(this.districtCode).subscribe(data => {
      this.district = (data as any).data;
      this.wards = this.district;
    })
  }

 setProvinceCode(event: Event) {
  let selectedOptionData = ((event.target  as HTMLSelectElement).selectedOptions[0] as HTMLOptionElement)?.getAttribute("data");
  this.provinceCode = Number(selectedOptionData);

  this.postForm?.get('city')?.setValue(((event.target as HTMLSelectElement).selectedOptions[0] as HTMLOptionElement)?.value);

  this.getDistricts1();
   setTimeout(() => {
        let districtSelectElement: HTMLSelectElement = this.districtSelect.nativeElement;
                let districtSelectOptionData = (districtSelectElement.selectedOptions[0] as HTMLOptionElement)?.getAttribute("data");
                this.districtCode = Number(districtSelectOptionData);
                 this.postForm?.get('district')?.setValue((districtSelectElement.selectedOptions[0] as HTMLOptionElement)?.value);
                this.getWards1();
                setTimeout(() => {
              let wardSelectElement: HTMLSelectElement = this.wardSelect.nativeElement;
                let wardSelectOptionData = (wardSelectElement.selectedOptions[0] as HTMLOptionElement)?.getAttribute("data");
                this.wardCode = Number(wardSelectOptionData);
                 this.postForm?.get('ward')?.setValue((wardSelectElement.selectedOptions[0] as HTMLOptionElement)?.value);
                  setTimeout(() => {
                      this.getTienShip();
                  }, 500);
  }, 500);
  }, 500);

}

  setDistrictCode(event: Event) {
    let selectedOptionData = ((event.target  as HTMLSelectElement).selectedOptions[0] as HTMLOptionElement)?.getAttribute("data");
    this.districtCode = Number(selectedOptionData);

     this.postForm?.get('district')?.setValue(((event.target as HTMLSelectElement).selectedOptions[0] as HTMLOptionElement)?.value);
    this.getWards1();
    setTimeout(() => {
              let wardSelectElement: HTMLSelectElement = this.wardSelect.nativeElement;
                let wardSelectOptionData = (wardSelectElement.selectedOptions[0] as HTMLOptionElement)?.getAttribute("data");
                this.wardCode = Number(wardSelectOptionData);
                 this.postForm?.get('ward')?.setValue((wardSelectElement.selectedOptions[0] as HTMLOptionElement)?.value);
                  setTimeout(() => {
                      this.getTienShip();
                  }, 500);
  }, 500);

  }

  setWardCode(event: Event) {
    let selectedOptionData = ((event.target  as HTMLSelectElement).selectedOptions[0] as HTMLOptionElement)?.getAttribute("data");
    this.wardCode = Number(selectedOptionData);

      this.postForm?.get('ward')?.setValue(((event.target as HTMLSelectElement).selectedOptions[0] as HTMLOptionElement)?.value);

     setTimeout(() => {
            this.getTienShip();
    }, 500);

  }

}

