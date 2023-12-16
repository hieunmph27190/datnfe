import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/common/Cart';
import { CartDetail } from 'src/app/common/CartDetail';
import { Customer } from 'src/app/common/Customer';
import { Favorites } from 'src/app/common/Favorites';
import { productdetail } from 'src/app/common/productdetail';
import { CartService } from 'src/app/services/cart.service';
import { CustomerService } from 'src/app/services/customer.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { ProductService } from 'src/app/services/product.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  productdetail!: productdetail;

  productdetails!: productdetail[];

  id1!: string;

  isLoading = true;

  customer!: Customer;
  favorite!: Favorites;
  favorites!: Favorites[];
  totalLike!: number;

  cart!: Cart;

  cartDetail! : CartDetail;
  cartDetails!: CartDetail[];
  countRate!:number;

  itemsComment:number = 3;
  
  constructor(
    private modalService: NgbModal,
    private productService :ProductService,
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService, 
    private favoriteService: FavoritesService,
    private sessionService: SessionService,
    // private rateService: RateService
    
    
    ) {
    route.params.subscribe(val => {
      this.ngOnInit();
    })
  }

  slideConfig = {"slidesToShow": 7, "slidesToScroll": 2, "autoplay": true};

  ngOnInit(): void {
    this.modalService.dismissAll();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.route.snapshot.params['id'];
    this.getProduct();
    // this.getRates();
    this.getTotalLike();
    // this.getAllRate();
  }

  setItemsComment(size: number) {
    this.getProduct();
    this.getTotalLike();
    this.itemsComment = size;
    console.log(this.itemsComment);
    
  }


  getProduct() {
    this.productService.getOne(this.id1).subscribe(data => {
      this.isLoading = false;
      this.productdetail = data as productdetail;
      this.productService.getSuggest(this.productdetail.id).subscribe(data => {
        this.productdetails = data as productdetail[];
      })
    }, error => {
      this.toastr.error('Sản phẩm không tồn tại!', 'Hệ thống');
      this.router.navigate(['/home'])
    })
  }
  


  // getRates() {
  //   this.rateService.getByProduct(this.id).subscribe(data=>{
  //     this.rates = data as Rate[];
  //   }, error=>{
  //     this.toastr.error('Lỗi hệ thống!', 'Hệ thống');
  //   })
  // }


  // getAllRate() {
  //   this.rateService.getAll().subscribe(data => {
  //     this.rateAll = data as Rate[];
  //   })
  // }


//   getAvgRate(id: number): number {
//     let avgRating: number = 0;
//     this.countRate = 0;
//     for (const item of this.rateAll) {
//       if (item.product.productId === id) {
//         avgRating += item.rating;
//         this.countRate++;
//       }
//     }
//     return this.countRate==0 ? 0 : Math.round(avgRating/this.countRate * 10) / 10;
//   }



  toggleLike(id: string) {
    let email = this.sessionService.getUser();
    if (email == null) {
      this.router.navigate(['/sign-form']);
      this.toastr.info('Hãy đăng nhập để sử dụng dịch vụ của chúng tôi', 'Hệ thống');
      return;
    }



    this.favoriteService.getByproductdetailIidAndEmail(id, email).subscribe(data => {
      if (data == null) {
        this.customerService.getByEmail(email).subscribe(data => {
          this.customer = data as Customer;
          this.favoriteService.post(new Favorites(0, new Customer(this.customer.userid), new productdetail(id))).subscribe(data => {
            this.toastr.success('Thêm thành công!', 'Hệ thống');
            this.favoriteService.getByEmail(email).subscribe(data => {
              this.favorites = data as Favorites[];
              this.favoriteService.setLength(this.favorites.length);
              this.getTotalLike();
            }, error => {
              this.toastr.error('Lỗi truy xuất dữ liệu!', 'Hệ thống');
            })
          }, error => {
            this.toastr.error('Thêm thất bại!', 'Hệ thống');
          })
        })
      } 
      else {
        this.favorite = data as Favorites;
        this.favoriteService.delete(this.favorite.favoriteId).subscribe(data => {
          this.toastr.info('Đã xoá ra khỏi danh sách yêu thích!', 'Hệ thống');
          this.favoriteService.getByEmail(email).subscribe(data => {
            this.favorites = data as Favorites[];
            this.favoriteService.setLength(this.favorites.length);
            this.getTotalLike();
          }, error => {
            this.toastr.error('Lỗi truy xuất dữ liệu!', 'Hệ thống');
          })
        }, error => {
          this.toastr.error('Lỗi!', 'Hệ thống');
        })
      }
    })
  }


  getTotalLike() {
    this.favoriteService.getByproductdetail(this.id1).subscribe(data => {
      this.totalLike = data as number;
    })
  }


  
  addCart(id: string, price: number) {
    let email = this.sessionService.getUser();
    if (email == null) {
      this.router.navigate(['/sign-form']);
      this.toastr.info('Hãy đăng nhập để sử dụng dịch vụ của chúng tôi', 'Hệ thống');
      return;
    }
    this.cartService.getCart(email).subscribe(data => {
      this.cart = data as Cart;
      this.cartDetail = new CartDetail(0, 1, price, new productdetail(id), new Cart(this.cart.cart_id));
      this.cartService.postDetail(this.cartDetail).subscribe(data => {
        this.toastr.success('Thêm vào giỏ hàng thành công!', 'Hệ thống!');
        this.cartService.getAllDetail(this.cart.cart_id).subscribe(data => {
          this.cartDetails = data as CartDetail[];
          this.cartService.setLength(this.cartDetails.length);
        })
      }, error => {
        this.toastr.error('Sản phẩm này có thể đã hết hàng!', 'Hệ thống');
        this.router.navigate(['/home']);
        window.location.href = "/";
      })
    })
  }


}





