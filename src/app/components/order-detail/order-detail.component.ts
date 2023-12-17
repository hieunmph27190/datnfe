import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/common/Order';
import { OrderDetail } from 'src/app/common/OrderDetail';
import { DataTableReponse } from 'src/app/dto/DataTableReponse';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  @Input() billId!:string;
  orderDetails!:OrderDetail[];
  totalPrice!:number;

  bill!:Order; 
  dataTableReponse!: DataTableReponse<OrderDetail>;

  @Input() id!:string;

  constructor(private modalService: NgbModal, private orderService: OrderService, private toastr: ToastrService) { }

  ngOnInit(): void {
    // this.getOrder();
   
  }


  // getOrder() {
  //   this.orderService.getById(this.id).subscribe(data=>{
  //     this.order = data as Order;
  //   },error=>{
  //     this.toastr.error('Lỗi server', 'Hệ thống');
  //   })
  // }



  // getItems() {
  //   this.orderService.getByOrder(this.id).subscribe(data=>{
  //     this.orderDetails = data as OrderDetail[];      
  //   },error=>{
  //     this.toastr.error('Lỗi server', 'Hệ thống');
  //   })
  // }

  getBillDetail() {
   this.orderService.getBilldetail(this.billId).subscribe(data => {
      this.dataTableReponse = data as DataTableReponse<OrderDetail>;
    },error =>{
         this.toastr.error('Lỗi server!', 'Hệ thống')
    });
   }

  getBill() {
   this.orderService.getById(this.billId).subscribe(data => {
      this.bill = data as Order;
    },error =>{
         this.toastr.error('Lỗi server!', 'Hệ thống')
    });
   }

  getTotalPrice() {
   this.orderService.getTotalPriceByBillId(this.billId).subscribe(data => {
      this.totalPrice = data as number;
    },error =>{
         this.toastr.error('Lỗi server!', 'Hệ thống')
    });
   }





  open(content: TemplateRef<any>) {
    this.modalService.open(content, {centered: true, size: 'xl'})
     this.getBillDetail();
     this.getBill();
    this.getTotalPrice();
  }

  finish() {
    this.ngOnInit();
  }

}
