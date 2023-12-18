import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ProvinceService {

  provinces1='https://online-gateway.ghn.vn/shiip/public-api/master-data/province'
  districts1='https://online-gateway.ghn.vn/shiip/public-api/master-data/district'
  wards1='https://online-gateway.ghn.vn/shiip/public-api/master-data/ward';

  province1='https://online-gateway.ghn.vn/shiip/public-api/master-data/province'
  district1='https://online-gateway.ghn.vn/shiip/public-api/master-data/district'
  ward1='https://online-gateway.ghn.vn/shiip/public-api/master-data/ward';

    Apitoken= 'bc002d03-9cf5-11ee-96dc-de6f804954c9';


  constructor(private http: HttpClient) { }

  getAllProvinces1() {
    const headers = new HttpHeaders({
      'token': this.Apitoken,
    });
    return this.http.get(this.provinces1, { headers });
  }


  getDistricts1(code:number) {
    const headers = new HttpHeaders({
      'token': this.Apitoken,
    });

    return this.http.get(this.districts1+'?Province_id='+code, { headers });
  }


  getALLDistricts1() {
    const headers = new HttpHeaders({
      'token': this.Apitoken,
    });

    return this.http.get(this.district1, { headers });
  }

  getWards1(code:number) {
    const headers = new HttpHeaders({
      'token': this.Apitoken,
    });
    return this.http.get(this.wards1+'?district_id='+code, { headers });
  }

  getProvince1(id: number) {
    const headers = new HttpHeaders({
      'token': this.Apitoken,
    });

    return this.http.get(this.province1+id, { headers });
  }

  getDistrict1(id: number) {
    const headers = new HttpHeaders({
      'token': this.Apitoken,
    });

    return this.http.get(this.district1+id, { headers });
  }
  getWard1(id: number) {
    const headers = new HttpHeaders({
      'token': this.Apitoken,
    });
    return this.http.get(this.ward1+id, { headers });
  }

}
