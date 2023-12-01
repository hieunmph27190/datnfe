import { areAllEquivalent } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/common/Cart';
import { CartDetail } from 'src/app/common/CartDetail';
import { Color } from 'src/app/common/Color';
import { Customer } from 'src/app/common/Customer';
import { Favorites } from 'src/app/common/Favorites';
import { Product } from 'src/app/common/Product';
import { ProductDetail } from 'src/app/common/ProductDetail';
import { Size } from 'src/app/common/Size';
// import { Rate } from 'src/app/common/Rate';
import { CartService } from 'src/app/services/cart.service';
import { CustomerService } from 'src/app/services/customer.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { ProductService } from 'src/app/services/product.service';
// import { RateService } from 'src/app/services/rate.service';
import { SessionService } from 'src/app/services/session.service';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  @ViewChildren('colorRadio') colorRadios!: QueryList<any>;

  product!: Product;
  productdetail!: ProductDetail;

  productdetails!: ProductDetail[];

  productImage!:string[];

  colors!:Color[];

  sizes!:Size[];

  id!: string;


  isLoading = true;
  slideConfig = {"slidesToShow": 5, "slidesToScroll": 5, "autoplay": true};
  customer!: Customer;
  favorite!: Favorites;
  totalLike!: number;
  favorites!: Favorites[];

  cart!: Cart;

  cartDetail! : CartDetail;
  cartDetails!: CartDetail[];


  itemsComment:number = 3;

  selectedSize: any = null;

  countRate!:number;
  
  selectedColors: { [key: string]: boolean } = {};

  showSelectedColors() {
    // Lọc những màu đã chọn
    const selectedColorList = Object.keys(this.selectedColors).filter(color => this.selectedColors[color]);

    // Thực hiện các hành động với thông tin màu đã chọn, ví dụ: chuyển đến trang khác, gửi lên server, vv.
    console.log('Màu đã chọn:', selectedColorList);

    // Bạn có thể thêm các hành động khác ở đây tùy thuộc vào yêu cầu của bạn
  }
  
  constructor(
    private modalService: NgbModal,
    private productService :ProductService,
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService, 
    private favoriteService: FavoritesService,
    // private rateService: RateService,
    private sessionService: SessionService) {
    route.params.subscribe(val => {
      this.ngOnInit();
    })
  }

  showColorSection: boolean = false;
  showPrice: boolean = false;


  ngOnInit(): void {
    this.modalService.dismissAll();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.id = this.route.snapshot.params['id'];
    this.getProduct();
  }



  reloadCurrentPage() {
    // Lấy URL hiện tại
    const currentUrl = this.router.url;

    // Tải lại trang
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });

    window.location.reload();
  }

  setItemsComment(size: number) {
    this.getProduct();
    // this.getRates();
    this.getTotalLike();
    // this.getAllRate();
    this.itemsComment = size;
    console.log(this.itemsComment);
    
  }

isLoggedOut = true; // Mặc định, người dùng chưa đăng nhập

checkLogin() {
  if (this.sessionService.getUser() != null) {
    this.isLoggedOut = false; // Đã đăng nhập
  }else{


  }
}
selectedColor(event: Event) {
  this.productService.getSizesByProductIdAndColorId(this.product.id,(event.target as HTMLInputElement).value).subscribe(data => {
    this.sizes = data as Size[];
  })
  this.showColorSection = true;
  this.productdetail = {} as ProductDetail;
  this.showPrice = false;  
}
getProductDetail(event: Event) { 
  let checkedRadio = this.colorRadios.find(radio => radio.nativeElement.checked);
  this.productService.getByProductIdAndColorIdAndSizeIdAndType(this.product.id,checkedRadio.nativeElement.value,(event.target as HTMLInputElement).value).subscribe(data => {
    this.productdetail = data as ProductDetail;
    this.showPrice = true;  
  })

  
}


// getAllRate() {
//   this.rateService.getAll().subscribe(data => {
//     this.rateAll = data as Rate[];
//   })
// }



// getRates() {
//   this.rateService.getByProductdetail(this.id).subscribe((data: any)=>{
//     this.rates = data as Rate[];
//   },
//   (error: any)=>{
//     this.toastr.error('Lỗi hệ thống!', 'Hệ thống');
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

  getProduct() {
    this.productService.getOne(this.id).subscribe(data => {
      this.isLoading = false;
      this.product = data as Product;
      this.productService.getProductDetails(this.product.id).subscribe(data => {
        this.productdetails = data as ProductDetail[];
      })
      this.productService.getProductImage(this.product.id).subscribe(data => {
        this.productImage = data as string[];
      })
      this.productService.getColorsByProductId(this.product.id).subscribe(data => {
        this.colors = data as Color[];
      })
    }, error => {
      this.toastr.error('Sản phẩm không tồn tại!', 'Hệ thống');
      this.router.navigate(['/home'])
    })
  }


checklogindk() {
  let email = this.sessionService.getUser();
  if (email == null) {
    this.router.navigate(['/sign-form']);
    this.toastr.info('Hãy đăng kí để sử dụng dịch vụ !', 'Hệ thống');
    return;
  }
}

// yeu thich
productLikes: { [id: string]: boolean } = {};


getTotalLike() {
  this.favoriteService.getByproductdetail(this.id).subscribe(data => {
    this.totalLike = data as number;
  })
}

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


  
  // addCart(id: string, price: number) {
  //   let email = this.sessionService.getUser();
  //   if (email == null) {
  //     this.router.navigate(['/sign-form']);
  //     this.toastr.info('Hãy đăng nhập để sử dụng dịch vụ của chúng tôi', 'Hệ thống');
  //     return;
  //   }
  //   this.cartService.getCart(email).subscribe(data => {
  //     this.cart = data as Cart;
  //     this.cartDetail = new CartDetail(0, 1, price, new productdetail(id), new Cart(this.cart.cart_id));
  //     this.cartService.postDetail(this.cartDetail).subscribe(data => {
  //       this.toastr.success('Thêm vào giỏ hàng thành công!', 'Hệ thống!');
  //       this.cartService.getAllDetail(this.cart.cart_id).subscribe(data => {
  //         this.cartDetails = data as CartDetail[];
  //         this.cartService.setLength(this.cartDetails.length);
  //       })
  //     }, error => {
  //       this.toastr.error('Sản phẩm này có thể đã hết hàng!', 'Hệ thống');
  //       this.router.navigate(['/home']);
  //       window.location.href = "/";
  //     })
  //   })
  // }


}





