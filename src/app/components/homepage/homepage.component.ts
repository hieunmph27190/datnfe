import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/common/Cart';
import { Color } from 'src/app/common/Color';
import { Customer } from 'src/app/common/Customer';
import { Favorites } from 'src/app/common/Favorites';
import { CustomerService } from 'src/app/services/customer.service';localStorage
import { ProductService } from 'src/app/services/product.service';
import { SessionService } from 'src/app/services/session.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { CartService } from 'src/app/services/cart.service';
import { CartDetail } from 'src/app/common/CartDetail';
import { DataTableReponse } from 'src/app/dto/DataTableReponse';
import { ProductBanHangResponse } from 'src/app/dto/ProductBanHangResponse';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  isLoading = true;

  customer!: Customer;

  favorite!: Favorites;

  favorites!: Favorites[];

  colorr!: Color[];

  products!: DataTableReponse<ProductBanHangResponse>;

  cart!: Cart;
  cartDetail!: CartDetail;
  cartDetails!: CartDetail[];

  countRate!: number;

  slideConfig = {"slidesToShow": 5, "slidesToScroll": 5, "autoplay": true};

  constructor(
    private productService: ProductService,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private sessionService: SessionService,
    private favoriteService: FavoritesService,
    private cartService: CartService,
    private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.getAllProductRated();
  }

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

}
