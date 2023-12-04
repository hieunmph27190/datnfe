import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/common/Customer';
import { District } from 'src/app/common/District';
import { Order } from 'src/app/common/Order';
import { Province } from 'src/app/common/Province';
import { Ward } from 'src/app/common/Ward';
import { BillReponse } from 'src/app/dto/BillReponse';
import { DataTableReponse } from 'src/app/dto/DataTableReponse';
import { SignupRequest } from 'src/app/dto/SignupRequest';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { NotificationService } from 'src/app/services/notification.service';
import { OrderService } from 'src/app/services/order.service';
import { ProvinceService } from 'src/app/services/province.service';
import { SessionService } from 'src/app/services/session.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
@ViewChild('citySelect') citySelect!: ElementRef;
@ViewChild('districtSelect') districtSelect!: ElementRef;
  customer!: Customer;
  orders!: Order[];
  
  page: number = 1;

  done!: number;


  provinces!: Province[];
  districts!: District[];

  wards!: Ward[];
  profileForm!: FormGroup;
  provinceCode!: number;
  districtCode!: number;
  wardCode!: number;

  province!: Province;
  district!: District;
  ward!: Ward;

  constructor(
    private customerService: CustomerService,
    private toastr: ToastrService,
    private sessionService: SessionService,
    private router: Router,
     private location: ProvinceService,
    private orderService: OrderService,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private renderer: Renderer2
   ) {
   this.profileForm = new FormGroup({
      'name': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'phoneNumber': new FormControl(null, [Validators.required, Validators.minLength(10), Validators.pattern('(0)[0-9]{9}')]),
      'city': new FormControl(0, [Validators.required, Validators.min(1)]),
      'district': new FormControl(0, [Validators.required, Validators.min(1)]),
      'ward': new FormControl(0, [Validators.required, Validators.min(1)]),
      'address': new FormControl('', Validators.required),
      'gender': new FormControl(true, Validators.required),
      'email': new FormControl("", Validators.required),
      
    });
  }


  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.getProfile();
    this.getProvinces();
    // this.getOrder();
  }

   selectCityWithValue(value: string) {
    let selectElement: HTMLSelectElement = this.citySelect.nativeElement;
    // Duyệt qua các option và chọn option có giá trị là value
    Array.from(selectElement.options).forEach((option: HTMLOptionElement) => {
      option.selected = option.value == value;
    });
  }

   getProfile() {
    this.authService.profile().subscribe(data => {
        this.customer = data as Customer;
        this.profileForm.setValue({
            'name':  this.customer.name,
            'phoneNumber': this.customer.phoneNumber,
            'city': this.customer.city,
            'district': this.customer.district,
            'ward': this.customer.ward,
            'address': this.customer.address,
            'gender': this.customer.gender,
            'email': this.customer.email,

        });
        setTimeout(() => {
            let citySelectElement: HTMLSelectElement = this.citySelect.nativeElement;
           let citySelectedOptionData = (citySelectElement.selectedOptions[0] as HTMLOptionElement).getAttribute("data");
            this.provinceCode = Number(citySelectedOptionData);
         this.getDistricts();
          this.profileForm.setValue({
            'name':  this.customer.name,
            'phoneNumber': this.customer.phoneNumber,
            'city': this.customer.city,
            'district': this.customer.district,
            'ward': this.customer.ward,
            'address': this.customer.address,
            'gender': this.customer.gender,
             'email': this.customer.email,
        });
         setTimeout(() => {
            let districtSelectElement: HTMLSelectElement = this.districtSelect.nativeElement;
                    let districtSelectOptionData = (districtSelectElement.selectedOptions[0] as HTMLOptionElement).getAttribute("data");
                    this.districtCode = Number(districtSelectOptionData);
                    this.getWards();
                      this.profileForm.setValue({
                        'name':  this.customer.name,
                        'phoneNumber': this.customer.phoneNumber,
                        'city': this.customer.city,
                        'district': this.customer.district,
                        'ward': this.customer.ward,
                        'address': this.customer.address,
                        'gender': this.customer.gender,
                         'email': this.customer.email,
                    });
         }, 500);
        }, 500);
        
           
        
      },error =>{
        this.toastr.error('lỗi!', 'Hệ thống');
      }
    ); 
  }

  
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

  finish() {
    this.ngOnInit();
  }
  changeProfile() {
     if (this.profileForm.invalid) {
      this.toastr.error('Hãy nhập đầy đủ thông tin!', 'Hệ thống');
      return;
    }
    
    if (true) {
      let signupRequest = (this.profileForm.value as SignupRequest);
      this.authService.changeProfile(signupRequest).subscribe(data => {
        Swal.fire({
          icon: 'success',
          title: 'Thay đổi thành công!',
          showConfirmButton: false,
          timer: 1500
        })
      
      }, error => {
        console.log(error)
        this.toastr.error(error.message, 'Hệ thống');
      });
    }
    else {

    }
  }

}
