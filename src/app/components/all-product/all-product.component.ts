import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { Cart } from 'src/app/common/Cart';
import { CartDetail } from 'src/app/common/CartDetail';
import { Category } from 'src/app/common/Category';
import { Customer } from 'src/app/common/Customer';
import { Favorites } from 'src/app/common/Favorites';
import { DataTableReponse } from 'src/app/dto/DataTableReponse';
import { ProductBanHangResponse } from 'src/app/dto/ProductBanHangResponse';
import { CartService } from 'src/app/services/cart.service';
import { CategoryService } from 'src/app/services/category.service';
import { CustomerService } from 'src/app/services/customer.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { ProductService } from 'src/app/services/product.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.css']
})
export class AllProductComponent implements OnInit {

  products!: DataTableReponse<ProductBanHangResponse>;
  categorys!: DataTableReponse<Category>;
  isLoading = true;
  customer!: Customer;
  favorite!: Favorites;
  favorites!: Favorites[];

  activeItem: any = null;
  cart!: Cart;
  cartDetail!: CartDetail;
  cartDetails!: CartDetail[];

  page: number = 1;

  size: number = 12;

  key: string = '';
  keyF: string = '';
  reverse: boolean = true;
  countRate!: number;

  constructor(
    private productService: ProductService,
    private categoryService:CategoryService,
    private toastr: ToastrService,
    private favoriteService: FavoritesService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);

      // Bây giờ bạn có thể lấy tham số từ ActivatedRoute
      const productId = this.activatedRoute.snapshot.paramMap.get('id');
      if (productId) {
        // Sử dụng productId để làm gì đó...
      }
    });
    this.getCategorys();
    this.getAllProduct('');
   
 
  }
   setActive(item: any) {
    this.activeItem = item;
    this.getAllProduct(this.activeItem as string);
  }
  getCategorys() {
    this.categoryService.gets().subscribe(data=>{
      this.categorys = data as DataTableReponse<Category>;
    }, error=>{
      this.toastr.error('Lỗi server!', 'Hệ thống')   
      console.log(error);
    })
  }
  getAllProduct(categoryId:string) {
    this.productService.getAll({"categoryId":(categoryId==''?null:categoryId)}).subscribe(data=>{
      this.products = data as DataTableReponse<ProductBanHangResponse>;
      this.isLoading = false;
    }, error=>{
      this.toastr.error('Lỗi server!', 'Hệ thống')   
      console.log(error);
         
    })
  }
 
    // yeu thich
productLikes: { [id: string]: boolean } = {};

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

}
