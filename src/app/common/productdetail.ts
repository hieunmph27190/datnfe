import { Category } from "./Category";
import { Color } from "./Color";
import { Product } from "./Product";
import { size } from "./size";

export class productdetail {

    'id':string;
    'amount':number;
    'createDate': Date;
    'price': number;
    'type':number;
    'status': boolean;  
    'sold' : number;
    'color':Color;
    'discount':number;
    'product':Product;
    'size':size;
    'category': Category;


    
    constructor(id: string) {
        this.id = id;
    }


    
    // constructor(id: string,amount:number,createDate:Date,price:number,type:number,status:boolean,sold:number,size:size,color:Color,product:Product) {
    //     this.id = id;
    //     this.amount = amount;
    //     this.createDate = createDate;
    //     this.price = price;
    //     this.type = type;
    //     this.status = status;
    //     this.sold = sold;
    //     this.color = color;
    //     this.product = product;
    //     this.size = size;

    // }







    }