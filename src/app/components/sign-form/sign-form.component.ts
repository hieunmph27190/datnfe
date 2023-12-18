import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Login } from 'src/app/common/Login';
import { Register } from 'src/app/common/Register';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { UserLogin } from 'src/app/dto/UserLogin';
import { ProvinceService } from 'src/app/services/province.service';
import { Province } from 'src/app/common/Province';
import { District } from 'src/app/common/District';
import { Ward } from 'src/app/common/Ward';
import { DataService } from 'src/app/services/data.service';
import { SignupRequest } from 'src/app/dto/SignupRequest';
@Component({
  selector: 'app-sign-form',
  templateUrl: './sign-form.component.html',
  styleUrls: ['./sign-form.component.css']
})
export class SignFormComponent implements OnInit {

  login!: Login;
  register !: Register;
  show: boolean = false;
  loginForm: FormGroup;

  registerForm!: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  roles: string = '';
  isSingUp = false;

  provinces!: any[];

  districts!: any[];

   wards!: any[];

  provinceCode!: number;

  districtCode!: number;

  wardCode!: number;

  district!: any[];
  province!: any[];
  ward!: any[];

  constructor(
    private toastr: ToastrService,
    private location: ProvinceService,
    private router: Router,
    private authService: AuthService,
    private userService: CustomerService) {
    this.loginForm = new FormGroup({
      'email': new FormControl(null),
      'password': new FormControl(null)
    });


    this.registerForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'name': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'phoneNumber': new FormControl(null, [Validators.required, Validators.minLength(10), Validators.pattern('(0)[0-9]{9}')]),
      'city': new FormControl(0, [Validators.required, Validators.min(1)]),
      'district': new FormControl(0, [Validators.required, Validators.min(1)]),
      'ward': new FormControl(0, [Validators.required, Validators.min(1)]),
      'address': new FormControl('', Validators.required),
      'gender': new FormControl(true, Validators.required)
    });
  }

  ngOnInit(): void {
      this.getProvinces1();
  }



  sign_up(event?:Event) {
    if(this.isSingUp){
      this.toastr.error('Đang chờ xử lí!', 'Hệ thống');
      return;
    }
    if (this.registerForm.invalid) {
      this.toastr.error('Hãy nhập đầy đủ thông tin!', 'Hệ thống');
      return;
    }

    if (true) {
      (event?.target  as HTMLButtonElement).textContent = "Chờ xử lí ... ";
      this.isSingUp=true;
      let signupRequest = (this.registerForm.value as SignupRequest);
      this.authService.register(signupRequest).subscribe(data => {
        Swal.fire({
          icon: 'success',
          title: 'Đăng kí thành công!\n Mật khẩu của bạn được gửi về email!',
          showConfirmButton: false,
          timer: 4000
        })
        setTimeout(() => {
          window.location.href = ('/');
        },
          1500);
      }, error => {
        this.toastr.error(error.message, 'Hệ thống');
        this.isSingUp=false;
         (event?.target  as HTMLButtonElement).textContent = "Đăng ký miễn phí";
      });
    }
    else {
    }
  }

  sign_in() {
    this.login = this.loginForm.value;

    this.authService.login(this.login).subscribe(
      data => {
        let user = data as UserLogin;
        if(user.roles.includes("ROLE_USER")){
          this.authService.setData(user);

          setTimeout(() => {
            window.location.href= ('/home');
          })
        Swal.fire({
          icon: 'success',
          title: 'Đăng nhập thành công!',
          showConfirmButton: false,
          timer: 1500
        })
        }else{
            this.authService.logout().subscribe(data => {});
            this.toastr.error('Sai Quyền Đăng Nhập', 'Hệ thống');
        }
      },
      error => {
        this.toastr.error('Sai Thông Tin Đăng Nhập', 'Hệ thống');
        Swal.fire({
          icon: 'error',
          title: 'Đăng nhập thất bại!',
          showConfirmButton: false,
          timer: 1500
        })
        this.isLoginFailed = true;
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
      // this.district = data as District;
      this.district = (data as any).data;
      this.wards = this.district;
    })
  }

setProvinceCode1(event: Event) {
  let selectedOptionData = ((event.target  as HTMLSelectElement).selectedOptions[0] as HTMLOptionElement).getAttribute("data");
  this.provinceCode = Number(selectedOptionData);
  this.getDistricts1();
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
  
  toggle() {
    this.show = !this.show;
  }

}
