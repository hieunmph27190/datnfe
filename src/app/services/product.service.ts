import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // // url = 'http://localhost:8080/api/products';
  // url = 'http://localhost:8080/product/view';
  // url = 'http://localhost:8080/productdetail/view';
  url = 'http://localhost:8080/api/products';

  

  constructor(private httpClient: HttpClient) { }


  // getAll() {
  //   return this.httpClient.get(this.url);
  // }


  getLasted() {
    return this.httpClient.get(this.url+'/latest');
  }

  getAll() {
    return this.httpClient.get(this.url+'/bestseller');
  }

  getRated() {
    return this.httpClient.get(this.url+'/rated');
  }

  
  getOne(id: string) {
    return this.httpClient.get(this.url+'/'+id);
  }


  // getByCategory(id: number) {
  //   return this.httpClient.get(this.url+'/category/'+id);

  // }


  // getBySole(id: number) {
  //   return this.httpClient.get(this.url+'/sole/'+id);
  // }


  getSuggest(id: string) {
    return this.httpClient.get(this.url+'/suggest'+"/"+id);
  }
}
