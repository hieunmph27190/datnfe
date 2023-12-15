import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Login } from '../common/Login';
import { Register } from '../common/Register';
import { SignupRequest } from '../dto/SignupRequest';
// import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = 'http://localhost:8080/api/auth';
  

  private dataSubject = new BehaviorSubject<any>(null);
  public data$ = this.dataSubject.asObservable();

  setData(data: any) {
    this.dataSubject.next(data);
  }

  isLogin(){
     let currentData = this.dataSubject.getValue();
     return currentData !== null;
  }

  constructor(private http: HttpClient) { }

  login(userData: Login): Observable<any> {
    return this.http.post(this.url + '/signin', userData,{ withCredentials: true });
  }

  
  logout() {
    return this.http.post(this.url + '/signout',{},{ withCredentials: true });
  }
  

  profile() {
    return this.http.get("http://localhost:8080" + '/profile',{ withCredentials: true });
  }


  register(signupRequest :SignupRequest) {
    return this.http.post(this.url + '/signup/customer',signupRequest,{ withCredentials: true });
  }

  changeProfile(signupRequest :SignupRequest) {
    return this.http.put('http://localhost:8080/profile/change-profile-user',signupRequest,{ withCredentials: true });
  }

  
  changePass(object : any) {
      let params = new HttpParams(); 

      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          params = params.set(key, object[key]);
        }
      }

    return this.http.put('http://localhost:8080/profile/change-password',{},{ withCredentials: true, params: params });
  }


  forgotPassword(email: string) {
    return this.http.post(this.url + '/send-mail-forgot-password-token', email);
  }


}
