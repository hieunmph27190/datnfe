import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Cart } from 'src/app/common/Cart';
import { CartDetail } from 'src/app/common/CartDetail';
import { CartService } from 'src/app/services/cart.service';
import { Product } from 'src/app/common/Product';
import { SellOnProductRequest } from 'src/app/dto/SellOnProductRequest';
import { DataService } from 'src/app/services/data.service';
import { ProductDetail } from 'src/app/common/ProductDetail';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  @ViewChildren('selectProduct') selectProducts!: QueryList<any>;

  cart!: Cart;
  productsChecked: SellOnProductRequest[]=[];
  productDetailsChecked: ProductDetail[] =[];
  product!: Product;
  cartDetail!: CartDetail;
  cartDetails!: CartDetail[];
  totalPrice:number = 0;

  discount!:number;
  amount!:number;
  amountReal!:number;

  page: number = 1;

  constructor(
    private cartService: CartService,
    private dataService: DataService,
    private toastr: ToastrService,
    private router: Router,) {
      this.cartDetails=[];
   }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.discount=0;
    this.amount=0;
    this.amountReal=0;
    this.getAllItem();
  }

  getAllItem() {
      this.cartService.getAllDetail().subscribe(data => {
        this.cartDetails = data as CartDetail[];
         this.cartDetails.forEach(item => item.productDetail.quantity =1)
        this.cartService.setLength(this.cartDetails.length);
      });
  }

  getProductChecked(){
    this.productsChecked = []
    this.productDetailsChecked = []
    this.selectProducts.forEach((checkbox: any) => {
        if(checkbox.nativeElement.checked){
            let  sellOnProductRequest = new SellOnProductRequest(checkbox.nativeElement.value,checkbox.nativeElement.closest('tr').querySelector('input[name="quantity"]').value);
            let cartDetailFilter =  this.cartDetails.filter((item) => item.productDetail.id == checkbox.nativeElement.value)
            if(cartDetailFilter.length>0){
              sellOnProductRequest.setProductDetail(cartDetailFilter[0].productDetail);
            }
            this.productsChecked.push(sellOnProductRequest);
        }
    });
      this.cartService.getTotalPrice(this.productsChecked).subscribe((data) => {
         this.totalPrice =data as number;
      });
      this.dataService.setData(this.productsChecked);
  }

  selectedProductCount: number = 0;

  checkProduct(event?:Event){
    let selectAllProductInput = document.querySelector('input#selectAllProduct');

    if(this.isCheckAll()){
       (selectAllProductInput as HTMLInputElement ).checked = true;
    }else{
      (selectAllProductInput as HTMLInputElement ).checked = false;
    }
    this.getProductChecked();
  }

  changeQuantity(event?:Event,item?:any){
     (event?.target as HTMLInputElement).value =""+ (Math.round(Number((event?.target as HTMLInputElement).value)));
      item.productDetail.quantity=(Math.round(Number((event?.target as HTMLInputElement).value)));
    if( Number((event?.target as HTMLInputElement).value)<=0|| Number((event?.target as HTMLInputElement).value)>item.productDetail.amount){
      (event?.target as HTMLInputElement).value = "1";
      item.productDetail.quantity=1;
    }
    let selectAllProductInput = document.querySelector('input#selectAllProduct');
    if(this.isCheckAll()){
       (selectAllProductInput as HTMLInputElement ).checked = true;
    }else{
      (selectAllProductInput as HTMLInputElement ).checked = false;
    }
    this.getProductChecked();
  }

  checkAll(event : Event) {
      let isChecked = (event.target as HTMLInputElement).checked;
      if(isChecked){
          this.selectProducts.forEach((checkbox: any) => {
            checkbox.nativeElement.checked = true;
          });
      }else if(this.isCheckAll()){
          this.selectProducts.forEach((checkbox: any) => {
            checkbox.nativeElement.checked = false;
          });
      }

       this.getProductChecked();
  }

  isCheckAll() {
      let checkAll = true;
      this.selectProducts.forEach((checkbox: any) => {
        if(!checkbox.nativeElement.checked){
          checkAll=false;
        }
      });
     return checkAll;
  }

  datHang() {
      if(this.productsChecked.length>0){
        let check = true;
        this.productsChecked.forEach((item) => {
             if(item.productDetail.amount==0){
              this.toastr.error('Sản phẩm đã hết hàng');
              check=false;
              return;
            }
            if(item.productDetail.quantity<=0||item.productDetail.quantity>item.productDetail.amount){
              this.toastr.error('Số lượng sản phẩm không hợp lệ');
              check=false;
              return;
            }
            if(item.productDetail.type==0||item.productDetail.product.type==0){
              this.toastr.error(item.productDetail.product.name+ "\nĐã ngừng kinh doanh");
              check=false;
              return;
            }
        })
        if(check){
           this.router.navigate(['/checkout']);
        }

      }else{
        this.toastr.error('Chưa chọn sản phẩm !', 'Hệ thống');
      }
  }

largeImageUrl: string | null = null;
  // Phương thức để hiển thị ảnh lớn
  showLargeImage(event: Event) {
    let divElement = event.target as HTMLElement;
    let imgElement = divElement.querySelector('img');
    console.log(divElement);
    if (divElement) {
      let src = divElement.getAttribute('src');
      this.largeImageUrl = src;
    }
  }

  delete(id: number) {
    Swal.fire({
      title: 'Bạn muốn xoá sản phẩm này ra khỏi giỏ hàng?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Không',
      confirmButtonText: 'Xoá'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.deleteDetail(id).subscribe(data => {
          this.toastr.success('Xoá thành công!', 'Hệ thống');
          this.ngOnInit();
        }, error => {
          this.toastr.error('Xoá thất bại! ' + error.status, 'Hệ thống');
        })
      }
    })
  }

}
