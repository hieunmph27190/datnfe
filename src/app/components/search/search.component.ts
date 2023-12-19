import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/common/Cart';
import { CartDetail } from 'src/app/common/CartDetail';
import { Category } from 'src/app/common/Category';
import { Customer } from 'src/app/common/Customer';
import { Favorites } from 'src/app/common/Favorites';
import { DataTableReponse } from 'src/app/dto/DataTableReponse';
import { ProductBanHangResponse } from 'src/app/dto/ProductBanHangResponse';
import { FavoritesService } from 'src/app/services/favorites.service';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

    products!: DataTableReponse<ProductBanHangResponse>;

    isLoading = true;
    customer!: Customer;
    favorite!: Favorites;
    favorites!: Favorites[];
    categories!: Category[];

    cart!: Cart;
    cartDetail!: CartDetail;
    cartDetails!: CartDetail[];

    page: number = 1;
    size: number = 12;
    key: string = '';
    keyF: string = '';


    keyword!: string;

    reverse: boolean = true;
    countRate!: number;

    constructor(
      private productService: ProductService,
      private toastr: ToastrService,
      private favoriteService: FavoritesService,
      private route: ActivatedRoute,
      private activatedRoute: ActivatedRoute,
      private router: Router) {
        route.params.subscribe(val => {
            this.ngOnInit();
          })
       }

    ngOnInit(): void {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
              return;
            }
            window.scrollTo(0, 0)
          });

        this.keyword = this.route.snapshot.params['keyword'];


        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
              return;
            }
            window.scrollTo(0, 0)
          });

      this.getAllProductRated();
    }



    getAllProductRated() {
      this.productService.getAll({"callAll":1}).subscribe(data=>{
        this.products = data as DataTableReponse<ProductBanHangResponse>;
        this.products.data = this.products.data.filter(p=>p.productName.toLowerCase().includes(this.keyword.toLowerCase()));
         this.isLoading = false;
      }, error=>{
        this.toastr.error('Lỗi server!', 'Hệ thống')
        console.log(error);

      })
    }


  // yeu thich
  productLikes: { [id: string]: boolean } = {};
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



}
