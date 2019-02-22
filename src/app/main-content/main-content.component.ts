import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent implements OnInit, OnDestroy {

  isProfile: boolean = false;
  userId:string = '';
  routeSubscription: Subscription;
  constructor(private route: ActivatedRoute, private userService: UserService,
    private postService: PostService) { }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.isProfile = true;
        this.userId = params['id'];
        
        this.postService.getUSerPosts(this.userId);
      } else {
        this.postService.getAllPosts();
      }
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

}
