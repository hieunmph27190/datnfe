import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/common/Cart';
import { Color } from 'src/app/common/Color';
import { Customer } from 'src/app/common/Customer';
import { Favorites } from 'src/app/common/Favorites';
// import { localStorage } from 'Storage'; // Đối với phiên bản Angular cụ thể nào đó
import { CustomerService } from 'src/app/services/customer.service';localStorage
import { ProductService } from 'src/app/services/product.service';
import { SessionService } from 'src/app/services/session.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { CartService } from 'src/app/services/cart.service';
import { CartDetail } from 'src/app/common/CartDetail';
import { ProductDetail } from 'src/app/common/ProductDetail';
import { DataTableReponse } from 'src/app/dto/DataTableReponse';
import { ProductBanHangResponse } from 'src/app/dto/ProductBanHangResponse';
// import { RateService } from 'src/app/services/rate.service';
// import { Rate } from 'src/app/common/Rate';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  // productSeller!:Product[];
  // productLatest!:Product[];

  // productRated!:Product[];

  isLoading = true;

  customer!: Customer;

  favorite!: Favorites;

  favorites!: Favorites[];

  colorr!: Color[];

  products!: DataTableReponse<ProductBanHangResponse>;

  cart!: Cart;
  cartDetail!: CartDetail;
  cartDetails!: CartDetail[];
  
  // rates!: Rate[];

  countRate!: number;

  slideConfig = {"slidesToShow": 5, "slidesToScroll": 5, "autoplay": true};

  constructor(
    private productService: ProductService,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private sessionService: SessionService,
    private favoriteService: FavoritesService,
    private cartService: CartService,
    // private rateService: RateService,
    private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.getAllProductRated();
    // this.getAllRate();
    // this.rates = []; // khởi tạo đánh giá là 1 mảng
  }

  // getAllProductBestSeller() {
  //   this.productService.getBestSeller().subscribe(data=>{
  //     this.productSeller = data as Product[];
  //     this.isLoading = false;
  //   }, error=>{
  //     this.toastr.error('Lỗi server!', 'Hệ thống')   
  //     console.log(error);   
  //   })
  // }
  
  // getAllProductLatest() {
  //   this.productService.getLasted().subscribe(data=>{
  //     this.productLatest = data as Product[];
  //     this.isLoading = false;
  //   }, error=>{
  //     this.toastr.error('Lỗi server!', 'Hệ thống')  
  //     console.log(error);    
  //   })
  // }
  

  // getAllRate() {
  //   this.rateService.getAll().subscribe(data => {
  //     this.rates = data as Rate[];
  //   })
  // }


  // getAvgRate(id: string): number {
  //   let avgRating: number = 0;
  //   this.countRate = 0;

  //   for (const item of this.rates) {
  //     if (item.productdetail.id === id) {
  //       avgRating += item.rating;
  //       this.countRate++;
  //     }
  //   }
  //   return Math.round(avgRating/this.countRate * 10) / 10;
  // }



  // getAvgRate(id: string): number {
  //   if (!this.rates || !Array.isArray(this.rates)) {
  //     // Kiểm tra nếu this.rates không được khởi tạo hoặc không phải là một mảng
  //     console.error("Invalid rates data.");
  //     return 0; // Hoặc một giá trị mặc định khác tùy thuộc vào yêu cầu của bạn
  //   }
  
  //   let avgRating: number = 0;
  //   this.countRate = 0;
  
  //   for (const item of this.rates) {
  //     if (item.productdetail && item.productdetail.id === id) {
  //       avgRating += item.rating;
  //       this.countRate++;
  //     }
  //   }
  
  //   // Kiểm tra nếu có ít nhất một đánh giá trước khi thực hiện phép chia
  //   if (this.countRate > 0) {
  //     return Math.round((avgRating / this.countRate) * 10) / 10;
  //   } else {
  //     return 0; // Hoặc một giá trị mặc định khác tùy thuộc vào yêu cầu của bạn
  //   }
  // }


  getAllProductRated() {
    this.productService.getAll().subscribe(data=>{
      this.products = data as DataTableReponse<ProductBanHangResponse>;
      this.isLoading = false;
    }, error=>{
      this.toastr.error('Lỗi server!', 'Hệ thống')   
      console.log(error);
         
    })
  }



   // thêm màu cho favorite
   productLikes: { [id: string]: boolean } = {};

  toggleLike(id: string) {
    let email = this.sessionService.getUser();
    if (email == null) {
      this.router.navigate(['/sign-form']);
      this.toastr.info('Hãy đăng nhập để sử dụng dịch vụ của chúng tôi', 'Hệ thống');
      return;
    }
  
    // this.favoriteService.getByproductdetailIidAndEmail(id, email).subscribe(data => {    
    //   if (data == null) {
    //     this.customerService.getByEmail(email).subscribe(data => {
    //       this.customer = data as Customer;
    //       this.favoriteService.post(new Favorites(0, new Customer(this.customer.userid), new productdetail(id))).subscribe(data => {
    //         this.toastr.success('Thêm thành công!', 'Hệ thống');
    //         this.productLikes[id] = true; // Đánh dấu sản phẩm đã được thích
    //         this.favoriteService.getByEmail(email).subscribe(data => {
    //           this.favorites = data as Favorites[];
    //           this.favoriteService.setLength(this.favorites.length);
    //         }, error => {
    //           this.toastr.error('Lỗi truy xuất dữ liệu!', 'Hệ thống');
    //         })
    //       }, error => {
    //         this.toastr.error('Thêm thất bại!', 'Hệ thống');
    //       })
    //     })
    //   } else {
    //     this.favorite = data as Favorites;
    //     this.favoriteService.delete(this.favorite.favoriteId).subscribe(data => {
    //       this.toastr.info('Đã xoá ra khỏi danh sách yêu thích!', 'Hệ thống');
    //       this.productLikes[id] = false; // Đánh dấu sản phẩm đã bị hủy thích
    //       this.favoriteService.getByEmail(email).subscribe(data => {
    //         this.favorites = data as Favorites[];
    //         this.favoriteService.setLength(this.favorites.length);
    //       }, error => {
    //         this.toastr.error('Lỗi truy xuất dữ liệu!', 'Hệ thống');
    //       })
    //     }, error => {
    //       this.toastr.error('Lỗi!', 'Hệ thống');
    //     })
    //   }
    // })
  }
  



  // addCart(id: string, price:number) {
  //   let email = this.sessionService.getUser();
  //   if (email == null) {
  //     this.router.navigate(['/sign-form']);
  //     this.toastr.info('Hãy đăng nhập để sử dụng dịch vụ của chúng tôi', 'Hệ thống');
  //     return;
  //   }
  //   this.cartService.getCart(email).subscribe(data => {
  //     this.cart = data as Cart;
  //     console.log(this.cart);
  //     this.cartDetail = new CartDetail(0, 1, price, new productDetail(id), new Cart(this.cart.cart_id));
  //     console.log(this.cartDetail);
  //     this.cartService.postDetail(this.cartDetail).subscribe(data => {
  //       this.toastr.success('Thêm vào giỏ hàng thành công!', 'Hệ thống!');
  //       this.cartService.getAllDetail(this.cart.cart_id).subscribe(data => {
  //         this.cartDetails = data as CartDetail[];
  //         this.cartService.setLength(this.cartDetails.length);
  //       console.log(this.cartDetail)
  //       })
  //     }, error => {
  //       this.toastr.error('Sản phẩm này có thể đã hết hàng!', 'Hệ thống');
  //       this.router.navigate(['/home']);
  //       window.location.href = "/";
  //     })
  //   })
  // }




}
