import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url = "http://localhost:8080/category";
  
  constructor(private httpClient: HttpClient) { }
  

  gets() {
    return this.httpClient.get(this.url+"?length=99999999");
  }

  getAllBestSeller() {
    return this.httpClient.get(this.url+'/bestseller');
  }

  getOne(id: string) {
    return this.httpClient.get(this.url + '/' + id);
  }
}
