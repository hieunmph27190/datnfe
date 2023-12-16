import { Category } from "./Category";
import { brand } from "./brand";
import { sole } from "./sole";


export class Product {
    'id':string;
    'code':string;
    'name': string;
    'type': number;
    'description':string;
    'createDate':Date;
    'sole':sole;
    'brand': brand;
    'category': Category;


    constructor(id:string) {
        this.id = id;
    }
    

}
