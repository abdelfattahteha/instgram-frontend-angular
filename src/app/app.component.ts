import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from './models/user.model';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  
  user: User;
  userSubscription: Subscription;

  constructor() {}

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
