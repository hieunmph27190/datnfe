import { areAllEquivalent } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
import { SellOnProductRequest } from 'src/app/dto/SellOnProductRequest';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { CustomerService } from 'src/app/services/customer.service';
import { DataService } from 'src/app/services/data.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { ProductService } from 'src/app/services/product.service';
import { SessionService } from 'src/app/services/session.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  @ViewChildren('colorRadio') colorRadios!: QueryList<any>;
  @ViewChild('imageModal') imageModal: any;
  product!: Product;
  productdetail!: ProductDetail;

  productsChecked: SellOnProductRequest[]=[];
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
  }

  constructor(
    private modalService: NgbModal,
    private productService :ProductService,
    private cartService: CartService,
    private dataService: DataService,
    private authService:AuthService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private favoriteService: FavoritesService,
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



  largeImageUrl: string | null = null;

  // Phương thức để hiển thị ảnh lớn
  showLargeImage(event: Event) {
    let divElement = event.target as HTMLElement;
    let imgElement = divElement.querySelector('img');
    if (divElement) {
      let src = divElement.getAttribute('src');
      this.largeImageUrl = src;

    }else{

    }
  }


//  currentImageIndex!: number;
//   imageUrls: string[] = []; // Mảng chứa tất cả URL của ảnh
//   largeImageUrl: string | null = null; // Chỉnh sửa thành 'string | null'


  // showLargeImage(event: Event, index: number) {
  //   const imgElement = event.target as HTMLImageElement;
  //   if (imgElement) {
  //     this.currentImageIndex = index;
  //     this.largeImageUrl = this.imageUrls[index];
  //   }
  // }

  // showPreviousImage() {
  //   if (this.currentImageIndex > 0) {
  //     this.currentImageIndex--;
  //     this.largeImageUrl = this.imageUrls[this.currentImageIndex];
  //   }
  // }

  // showNextImage() {
  //   if (this.currentImageIndex < this.imageUrls.length - 1) {
  //     this.currentImageIndex++;
  //     this.largeImageUrl = this.imageUrls[this.currentImageIndex];
  //   }
  // }





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
    this.getTotalLike();
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



  addCart() {
    if(this.productdetail?.id){
      this.cartService.postDetail(this.productdetail?.id).subscribe(data => {
        this.toastr.success('Thêm vào giỏ thành công!', 'Hệ thống!');
        this.cartService.getAllDetail().subscribe(data => {
          this.cartDetails = data as CartDetail[];
          this.cartService.setLength(this.cartDetails.length);
        })
      }, error => {
        if(error.status==401){
          this.checklogindk();
        }else{
          this.toastr.error(error.error, 'Hệ thống');
        }

      })
    }else{
       this.toastr.error('Chọn màu và size', 'Hệ thống');
    }

  }

  muaNgay() {
    this.authService.profile().subscribe(data => {
    if(this.productdetail?.type==0||this.productdetail==null||this.productdetail==undefined||this.product?.type==0){
      this.toastr.error('Sản phẩm đã ngưng kinh doanh');
      return;
    }
    if(this.productdetail?.amount==0||this.productdetail==null||this.productdetail==undefined){
      this.toastr.error('Sản phẩm đã hết hàng');
      return;
    }
    if(this.productdetail?.id){

          let quantityStr = prompt("Nhập số lượng :");
          if(quantityStr){
          }else{
            return;
          }
          let quantity = parseInt(quantityStr as string);
          if((!quantity)||(quantity<=0)){
            alert("Số lượng bạn nhập không đúng");
            return;
          }

        Swal.fire({
          title: 'Số lượng bạn mua là : '+quantity+" ?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Không',
          confirmButtonText: 'Đúng'
        }).then((result) => {
          if (result.isConfirmed) {
            this.productsChecked=[];
            let sellOnProductRequest = new SellOnProductRequest(this.productdetail.id,quantity);
            sellOnProductRequest.setProductDetail(this.productdetail);
            this.productsChecked.push(sellOnProductRequest);
            this.dataService.setData(this.productsChecked);
            if(this.productsChecked.length>0){
            this.router.navigate(['/checkout']);
            }else{
              this.toastr.error('Chưa chọn sản phẩm !', 'Hệ thống');
            }
          }
        })
        }else{
          this.toastr.error('Chọn màu và size', 'Hệ thống');
        }
    }, err => {
            this.checklogindk();
    });




  }
}





