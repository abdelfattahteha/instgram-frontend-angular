import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { Subscribable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: User;
  userSubscription: Subscription;
  
  constructor(private userService: UserService,
    private authService: AuthService, private router:Router) { }

  ngOnInit() {
    this.userSubscription = this.userService.getUser()
        .subscribe ( (user:User) => {
          this.user = user;
        });
  }

  logout() {
    let result = this.authService.logout();
    if (result) this.router.navigate(['/auth/login']);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
