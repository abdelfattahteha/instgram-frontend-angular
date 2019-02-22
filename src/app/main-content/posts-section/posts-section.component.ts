import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-posts-section',
  templateUrl: './posts-section.component.html',
  styleUrls: ['./posts-section.component.css']
})
export class PostsSectionComponent implements OnInit, OnDestroy {

  @Input() isProfile: boolean;
  @Input() userId: string;
  user:User;
  userSubscription: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userSubscription = this.userService.getUser().subscribe( (user:User) => {
      this.user = user;
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }


}
