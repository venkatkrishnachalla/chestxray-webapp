import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/module/auth/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

// AuthGuard class implementation  
export class AuthGuard implements CanActivate {
    /*  
    * Constrcutor for AuthGuard class  
    */  
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const user  = JSON.parse(sessionStorage.getItem('userAuthData'));
    const isAuthenticated = (!!this.authService.user || !!user);
    if (isAuthenticated) {
      return isAuthenticated;
    } else {
      return this.router.createUrlTree(['/auth/login']);
    }
  }
}
