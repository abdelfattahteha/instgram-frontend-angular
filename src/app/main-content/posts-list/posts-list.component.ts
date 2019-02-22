import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from '../../models/post.model';
import { MatDialog } from '@angular/material'; 
import { EditPostComponent } from '../edit-post/edit-post.component';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { FormControl, Validators } from '@angular/forms';
import  openSocket  from 'socket.io-client';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit, OnDestroy {
  @Input() userId: string;
  posts: Post[];
  postsSubscription: Subscription;
  socket: any;
  user: User;
  userSubscription: Subscription;
  newComment: FormControl;
  editedComment: FormControl;
  editedCommentIndex: number = -1;
  isLoading: boolean = false;


  constructor(private postService: PostService, 
    private dialog: MatDialog,
    private userService: UserService
    ) {
    this.socket =  openSocket(environment.apiUrl);
  }

  ngOnInit() {
    this.isLoading = true;
    this.userSubscription = this.userService.getUser().subscribe( (user:User) => {
      this.user = user;
    });

    if (this.userId) {
        this.postsSubscription = this.postService.getAllPostsSubject()
          .subscribe( (posts: Post[]) => {
            this.isLoading = false;
            this.posts = posts;
            console.log(posts);
          });
          this.postService.userProfileId = this.userId;
    } else {
        this.postsSubscription = this.postService.getAllPostsSubject()
          .subscribe( (posts: Post[]) => {
            this.isLoading = false;
            this.posts = posts;
            console.log(posts);
          });
    }

    // websocket
    this.socket.on('posts', (data) => {
      this.postService.handleWebSocket(data);
    });
    
    this.newComment = new FormControl('', Validators.required);

  }

  deletePost(post: Post) {
    this.postService.deletePost(post.id);
  }

  editPost(post: Post) {
    this.dialog.open(EditPostComponent, { data: { post: post}});
  }


  

  likeClicked(post: Post) {
    if (this.isLiked(post) ) {
      const likeIndex = post.likes.findIndex( like => {
        return like.user === this.user.id;
      });
      this.deleteLike(likeIndex,post);
    } else {
      this.addLike(post);
    }
  }

  addLike( post: Post) {
    this.postService.addLike(post.id);
  }

  deleteLike(likeIndex:number,post:Post) {
    const likeId = post.likes[likeIndex]._id;
    this.postService.deleteLike(likeId, post.id);
  }


  isLiked(post: Post) {
    const isLiked = post.likes.findIndex( like => {
      return like.user === this.user.id;
    });
    if (isLiked === -1) {
      return false;
    } else return true;
  }


  onEnterComment(post: Post) {
    const commentContent = this.newComment.value;
    this.postService.addComment(post.id, commentContent);
    this.newComment.reset();
  }

  deleteComment(comment:any ,post: Post) {
    this.postService.deleteComment(comment._id, post.id);
  }

  enableEditComment(post:Post,comment:any) {
    this.editedCommentIndex = post.comments.findIndex( (selectedComment) => {
      return selectedComment._id === comment._id;
    });
    this.editedComment = new FormControl(comment.content, Validators.required);
  }

  editComment(post: Post, comment: any) {
    const editCommentData = {postId: post.id, content: this.editedComment.value};
    this.postService.updateComment(comment._id, editCommentData)
        .subscribe ( (result: boolean) => {
          if (result) {
            this.editedComment.reset();
            this.editedCommentIndex =-1;
          }
        })
  }


  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

}
