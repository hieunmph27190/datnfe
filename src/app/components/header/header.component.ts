import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/common/Cart';
import { Category } from 'src/app/common/Category';
import { Favorites } from 'src/app/common/Favorites';
import { CustomerService } from 'src/app/services/customer.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { SessionService } from 'src/app/services/session.service';
import { CartService } from 'src/app/services/cart.service';
import { CartDetail } from 'src/app/common/CartDetail';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  isLogin: boolean = false;

  categories!: Category[];
  favorites!: Favorites[];
  cartDetails!: CartDetail[];
  cart!: Cart;

  totalFavoriteItem!: number;
  totalCartItem!: number;
  keyword: string = '';

  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private sessionService: SessionService,
    private favoriteService: FavoritesService,
    private authService: AuthService,
    private router: Router) { }
  
  ngOnInit(): void {

    this.favoriteService.$data.subscribe(data => {
      this.totalFavoriteItem = data;
    })

    this.cartService.$data.subscribe(data => {
      this.totalCartItem = data;
    })
    this.getAllFavorites();
    this.getAllCartItem();
    this.checkLogin();
  }

  search(event: any) {
    this.keyword = (event.target as HTMLInputElement).value;
  }

  getAllFavorites() {
    let email = this.sessionService.getUser();
    if (email == null) {
      return;
    }

    
    this.favoriteService.getByEmail(email).subscribe(data => {
      this.favorites = data as Favorites[];
      this.favoriteService.setLength(this.favorites.length);
    }, error => {
      this.toastr.error('Lỗi truy xuất dữ liệu!', 'Hệ thống');
    })
  }


  
  getAllCartItem() {
      this.cartService.getAllDetail().subscribe(data => {
        this.cartDetails = data as CartDetail[];
        this.cartService.setLength(this.cartDetails.length);
      },error => {
        this.cartDetails = [];
        this.cartService.setLength(0);
      });
  }


  


  // checkLogin() {
  //   let email = this.sessionService.getUser();
  //   this.customerService.getByEmail(email).subscribe(data => {
  //     this.isLogin = true;
  //   }, error => {
  //     this.sessionService.signOut();
  //     this.router.navigate(['home']);
  //   })
  // }

    // checkLogin() {
    // this.login = this.loginForm.value;
    //   this.isLogin = true;
    // }
    //    this.authService.login(this.login).subscribe(
    //   data => {
    //     let user = data as UserLogin;
    //     if(user.roles.includes("ROLE_USER")){
    //       this.router.navigate(['home']);
    //        this.isLoginFailed = false;
    //       this.isLoggedIn = false;

    //     }, error => {
    //   this.router.navigate(['home']);
    // })
    //     }

  checkLogin() {

  this.authService.profile().subscribe(
      data => {
       this.authService.setData(data as any);
          if(this.authService.isLogin()){
            this.isLogin = true;
          }else{
            this.isLogin = false;
          }
      },
      error => {
       
      }
    );
  }


  logout() {
     this.authService.logout().subscribe(
      data => {
       this.authService.setData(null);
          if(this.authService.isLogin()){
            this.isLogin = true;
          }else{
            this.isLogin = false;
          }
          this.ngOnInit();
          this.toastr.success('Đăng xuất thành công!', 'Hệ thống!');
            this.router.navigate(['/sign-form']);
      },
      error => {
        this.toastr.error('Lỗi', 'Hệ thống');
      }
    );
  }


  
  // getCategories() {
  //   this.categoryService.getAll().subscribe(data => {
  //     this.categories = data as Category[];
  //   })
  // }


  
}
