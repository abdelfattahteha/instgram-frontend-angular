import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, from } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from './user.service';

 
@Injectable({
  providedIn: 'root',
})
export class ProfileUserResolver implements Resolve<User> {
  constructor(private userService:UserService) {}
 
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> | 
  Observable<null> {
    
    if (route.params['id']) {
        this.userService.initUserProfile(route.params['id']);
    } else {
        return from(null);
    }
    
  }
}