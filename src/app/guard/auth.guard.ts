import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(public authService: AuthService, private _router: Router) { }

  canActivate(): boolean {
    if (this.authService.isLogin()) {
      return true;
    } else {
      this._router.navigate(['/sign-form'])
      return false;
    }
  }
  
}
