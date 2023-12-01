import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = 'http://localhost:8080/ban-hang/product';

  constructor(private httpClient: HttpClient) { }


  getAll1() { 
    return this.httpClient.get(this.url+'/allproduct');
  }


  getLasted() {
    return this.httpClient.get(this.url+'/latest');
  }

  getAll() {
    return this.httpClient.get(this.url);
  }


  getRated() {
    return this.httpClient.get(this.url+'/rated');
  }

  
  getOne(id: string) {
    return this.httpClient.get("http://localhost:8080/product"+'/'+id);
  }


  getByCategory(id: string) {
    return this.httpClient.get(this.url+'/category/'+id);
  }


  // getBySole(id: number) {
  //   return this.httpClient.get(this.url+'/sole/'+id);
  // }


  getProductDetails(id: string) {
    return this.httpClient.get("http://localhost:8080/product-detail?idProduct="+id);
  }
  getProductImage(id: string) {
    return this.httpClient.get("http://localhost:8080/product/imageID/"+id);
  }
  getColorsByProductId(id: string) {
    return this.httpClient.get("http://localhost:8080/product-detail/colors?productid="+id);
  }
  getSizesByProductIdAndColorId(productid: string,colorid: string) {
    return this.httpClient.get("http://localhost:8080/product-detail/sizes?productid="+productid+"&colorid="+colorid);
  }
  getByProductIdAndColorIdAndSizeIdAndType(productid: string,colorid: string,sizeid: string) {
    return this.httpClient.get("http://localhost:8080/product-detail/getOne?productid="+productid+"&colorid="+colorid+"&sizeid="+sizeid);
  }
}
