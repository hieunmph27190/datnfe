import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/common/Customer';
import { Order } from 'src/app/common/Order';
import { Ward } from 'src/app/common/Ward';
import { SignupRequest } from 'src/app/dto/SignupRequest';
import { AuthService } from 'src/app/services/auth.service';
import { ProvinceService } from 'src/app/services/province.service';
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


  provinces!: any[];

  districts!: any[];

  wards!: any[];

  profileForm!: FormGroup;

  provinceCode!: number;

  districtCode!: number;

  wardCode!: number;

  province!: any[];

  district!: any[];
  
  ward!: Ward;
  

  oldPassword!: string;
  newPassword!: string;
  confirmNewPassword!: string;

   @ViewChild('changePasswordModal') changePasswordModal!: ElementRef;


  constructor(
    private toastr: ToastrService,
    private router: Router,
     private location: ProvinceService,
    private authService: AuthService,
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
    this.getProvinces1();
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
           let citySelectedOptionData = (citySelectElement.selectedOptions[0] as HTMLOptionElement)?.getAttribute("data");
            this.provinceCode = Number(citySelectedOptionData);
         this.getDistricts1();
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
                    let districtSelectOptionData = (districtSelectElement.selectedOptions[0] as HTMLOptionElement)?.getAttribute("data");
                    this.districtCode = Number(districtSelectOptionData);
                    this.getWards1();
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

  getProvinces1() {
    this.location.getAllProvinces1().subscribe(data => {
      this.provinces = (data as any).data;
    })
  }

  getDistricts1() {
    this.location.getDistricts1(this.provinceCode).subscribe(data => {
      // this.province = data as Province;
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

setProvinceCode1(event: Event) {
  let selectedOptionData = ((event.target  as HTMLSelectElement).selectedOptions[0] as HTMLOptionElement).getAttribute("data");
  this.provinceCode = Number(selectedOptionData);

  this.getDistricts1();
  setTimeout(() => {
        let districtSelectElement: HTMLSelectElement = this.districtSelect.nativeElement;
                let districtSelectOptionData = (districtSelectElement.selectedOptions[0] as HTMLOptionElement).getAttribute("data");
                this.districtCode = Number(districtSelectOptionData);
                this.getWards1();
          
  }, 500);

}
  setDistrictCode1(event: Event) {
    let selectedOptionData = ((event.target  as HTMLSelectElement).selectedOptions[0] as HTMLOptionElement).getAttribute("data");
    this.districtCode = Number(selectedOptionData);
    this.getWards1();
  }

  setWardCode1(event: Event) {
    let selectedOptionData = ((event.target  as HTMLSelectElement).selectedOptions[0] as HTMLOptionElement).getAttribute("data");
    this.wardCode = Number(selectedOptionData);
  }

  finish() {
    this.ngOnInit();
  }


  changeProfile() {
     if (this.profileForm.invalid) {
      this.toastr.error('Hãy nhập đầy đủ thông tin!', 'Hệ thống');
      return;
    }
     Swal.fire({
      title: 'Bạn muốn thay đổi thông tin ??',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Không',
      confirmButtonText: 'Có'
    }).then((result) => {
      if (result.isConfirmed) {
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
    })
  }

   openChangePasswordDialog() {
    if (this.changePasswordModal) {
      this.changePasswordModal.nativeElement.style.display = 'block';
    }
  }


  closeChangePasswordDialog() {
    if (this.changePasswordModal) {
      this.changePasswordModal.nativeElement.style.display = 'none';
    }
  }

  changePassword() {
    // Kiểm tra xác nhận mật khẩu
    if (this.newPassword !== this.confirmNewPassword) {
       this.toastr.error("Mật khẩu mới và xác nhận mật khẩu mới không khớp.", 'Hệ thống');
      return;
    }
    Swal.fire({
          title: 'Bạn muốn thay đổi mật khẩu ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Không',
          confirmButtonText: 'Có'
        }).then((result) => {
          if (result.isConfirmed) {
         
    this.authService.changePass({"password":this.oldPassword,"newPassword":this.newPassword}).subscribe(data => {
        Swal.fire({
          icon: 'success',
          title: 'Thay đổi thành công!',
          showConfirmButton: false,
          timer: 1500
        })
        this.oldPassword="";
        this.newPassword="";
        this.confirmNewPassword="";
        this.closeChangePasswordDialog();
      }, error => {

        this.toastr.error(error.error, 'Hệ thống');
      });
          }
      })
}
}
