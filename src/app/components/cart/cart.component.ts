import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Cart } from 'src/app/common/Cart';
import { CartDetail } from 'src/app/common/CartDetail';
import { CartService } from 'src/app/services/cart.service';
import { SessionService } from 'src/app/services/session.service';
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

  constructor(
    private cartService: CartService,
    private dataService: DataService,
    private toastr: ToastrService,
    private router: Router,
    private sessionService: SessionService) {
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

  //   getAllItem() {
  //     this.cartService.getAllDetail().subscribe(data => {
  //       this.cartDetails = data as CartDetail[];
  //       this.cartService.setLength(this.cartDetails.length);
  //       this.cartDetails.forEach(item=>{
  //         this.amountReal += item.productdetail.price * item.quantity;
  //         this.amount += item.price;
  //       })
  //       this.discount = this.amount - this.amountReal;
  //     })
  
  // } 

  getAllItem() {
      this.cartService.getAllDetail().subscribe(data => {
        this.cartDetails = data as CartDetail[];
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
  checkProduct(){
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
        this.router.navigate(['/checkout']);
      }else{
        this.toastr.error('Chưa chọn sản phẩm !', 'Hệ thống');
      }
  }
  
//   getAllItem() {
//   this.cartService.getAllDetail().subscribe((data: CartDetail[]) => {
//     this.cartDetails = data.map((item: CartDetail) => ({ ...item, amount: 1 }));
//     this.cartService.setLength(this.cartDetails.length);
//   });
// }



  // update(id: number, quantity: number) {
  //   if (quantity < 1) {
  //     this.delete(id);
  //   } else {
  //     this.cartService.getOneDetail(id).subscribe(data => {
  //       this.cartDetail = data as CartDetail;
  //       this.cartDetail.quantity = quantity;
  //       this.cartDetail.price = (this.cartDetail.productdetail.price * (1 - this.cartDetail.productdetail.discount / 100)) * quantity;
  //       this.cartService.updateDetail(this.cartDetail).subscribe(data => {
  //         this.ngOnInit();
  //       }, error => {
  //         this.toastr.error('Lỗi!' + error.status, 'Hệ thống');
  //       })
  //     }, error => {
  //       this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
  //     })
  //   }
  // }


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
