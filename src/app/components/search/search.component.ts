// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { Cart } from 'src/app/common/Cart';
// import { CartDetail } from 'src/app/common/CartDetail';
// import { Category } from 'src/app/common/Category';
// import { Customer } from 'src/app/common/Customer';
// import { Favorites } from 'src/app/common/Favorites';
// import { productdetail } from 'src/app/common/productdetail';
// import { CartService } from 'src/app/services/cart.service';
// import { CustomerService } from 'src/app/services/customer.service';
// import { FavoritesService } from 'src/app/services/favorites.service';
// import { ProductService } from 'src/app/services/product.service';
// import { SessionService } from 'src/app/services/session.service';
// import { CategoryService } from 'src/app/services/category.service';

// @Component({
//   selector: 'app-search',
//   templateUrl: './search.component.html',
//   styleUrls: ['./search.component.css']
// })
// export class SearchComponent implements OnInit {



//   productdetails: productdetail[] = [];
//   isLoading: boolean = true;


//   // productdetails!: productdetail[];
//   // isLoading = true;
//   customer!: Customer;
//   favorite!: Favorites;
//   favorites!: Favorites[];
//   categories!: Category[];

//   cart!: Cart;
//   cartDetail!: CartDetail;
//   cartDetails!: CartDetail[];

//   page: number = 1;

//   key: string = '';
//   keyF: string = '';
//   reverse: boolean = true;

//   keyword!: string;

//   countRate!: number;

//   constructor(
//     private productService: ProductService,
//     private cartService: CartService,
//     private route: ActivatedRoute,
//     private customerService: CustomerService,
//     private toastr: ToastrService,
//     private favoriteService: FavoritesService,
//     private sessionService: SessionService,
//     private categoryService: CategoryService,
//     private router: Router) {
//     route.params.subscribe(val => {
//       this.ngOnInit();
//     })
//   }

//   ngOnInit(): void {
//     this.router.events.subscribe((evt) => {
//       if (!(evt instanceof NavigationEnd)) {
//         return;
//       }
//       window.scrollTo(0, 0)
//     });
//     this.keyword = this.route.snapshot.params['keyword'];

//     this.router.events.subscribe((evt) => {
//       if (!(evt instanceof NavigationEnd)) {
//         return;
//       }
//       window.scrollTo(0, 0)
//     });
//     this.getProducts();
//     this.getCategories();
//   }

//   getProducts() {
//     this.productService.getAll1().subscribe(data => {
//       this.isLoading = false;
//       this.productdetails = data as productdetail[];
//       this.productdetails = this.productdetails.filter(p => p.product.name.toLowerCase().includes(this.keyword.toLowerCase()) || p.price*(1 - p.discount/100) == Number(this.keyword));
//     }, error => {
//       this.toastr.error('Lỗi server!', 'Hệ thống');
//     })
//   }
//   getCategories() {
//     this.categoryService.getAll().subscribe(data => {
//       this.categories = data as Category[];
//     })
//   }


//   addCart(id: string, price:number) {
//     let email = this.sessionService.getUser();
//     if (email == null) {
//       this.router.navigate(['/sign-form']);
//       this.toastr.info('Hãy đăng nhập để sử dụng dịch vụ của chúng tôi', 'Hệ thống');
//       return;
//     }
//     this.cartService.getCart(email).subscribe(data => {
//       this.cart = data as Cart;
//       console.log(this.cart);
//       this.cartDetail = new CartDetail(0, 1, price, new productdetail(id), new Cart(this.cart.cart_id));
//       console.log(this.cartDetail);
//       this.cartService.postDetail(this.cartDetail).subscribe(data => {
//         this.toastr.success('Thêm vào giỏ hàng thành công!', 'Hệ thống!');
//         this.cartService.getAllDetail(this.cart.cart_id).subscribe(data => {
//           this.cartDetails = data as CartDetail[];
//           this.cartService.setLength(this.cartDetails.length);
//         console.log(this.cartDetail)
//         })
//       }, error => {
//         this.toastr.error('Sản phẩm này có thể đã hết hàng!', 'Hệ thống');
//         this.router.navigate(['/home']);
//         window.location.href = "/";
//       })
//     })
//   }


//   // yeu thich
// productLikes: { [id: string]: boolean } = {};

//   toggleLike(id: string) {
//     let email = this.sessionService.getUser();
//     if (email == null) {
//       this.router.navigate(['/sign-form']);
//       this.toastr.info('Hãy đăng nhập để sử dụng dịch vụ của chúng tôi', 'Hệ thống');
//       return;
//     }
  
//     this.favoriteService.getByproductdetailIidAndEmail(id, email).subscribe(data => {    
//       if (data == null) {
//         this.customerService.getByEmail(email).subscribe(data => {
//           this.customer = data as Customer;
//           this.favoriteService.post(new Favorites(0, new Customer(this.customer.userid), new productdetail(id))).subscribe(data => {
//             this.toastr.success('Thêm thành công!', 'Hệ thống');
//             this.productLikes[id] = true; // Đánh dấu sản phẩm đã được thích
//             this.favoriteService.getByEmail(email).subscribe(data => {
//               this.favorites = data as Favorites[];
//               this.favoriteService.setLength(this.favorites.length);
//             }, error => {
//               this.toastr.error('Lỗi truy xuất dữ liệu!', 'Hệ thống');
//             })
//           }, error => {
//             this.toastr.error('Thêm thất bại!', 'Hệ thống');
//           })
//         })
//       } else {
//         this.favorite = data as Favorites;
//         this.favoriteService.delete(this.favorite.favoriteId).subscribe(data => {
//           this.toastr.info('Đã xoá ra khỏi danh sách yêu thích!', 'Hệ thống');
//           this.productLikes[id] = false; // Đánh dấu sản phẩm đã bị hủy thích
//           this.favoriteService.getByEmail(email).subscribe(data => {
//             this.favorites = data as Favorites[];
//             this.favoriteService.setLength(this.favorites.length);
//           }, error => {
//             this.toastr.error('Lỗi truy xuất dữ liệu!', 'Hệ thống');
//           })
//         }, error => {
//           this.toastr.error('Lỗi!', 'Hệ thống');
//         })
//       }
//     })
//   }


// }
