import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Post } from '../models/post.model';
import { Subject, Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private url: string = environment.apiUrl + "/api/posts";
  private posts: Post[];
  private postsSubject = new Subject<Post[]>();
  isLoading = new EventEmitter<boolean>();
  isEditLoading = new EventEmitter<boolean>();
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    body: null
  };
  userProfileId: any;

  constructor( private http: HttpClient, private userService: UserService) {}
  

  getAllPosts() {
    this.http.get<{posts: any[]}>(this.url)
    .pipe(
      map(response => {
        return response.posts.map( post => {
          return this.transformPostData(post);
        })
      })
    ).subscribe( (posts: Post[]) => {
      this.posts = posts;
      this.postsSubject.next([...this.posts]);
    });
  }
  getAllPostsSubject(): Observable<Post[]>{
    return this.postsSubject.asObservable();
  }

  getUSerPosts(userId:string) {
    this.http.get<{posts: any[]}>(environment.apiUrl + `/api/users/${userId}/posts`)
    .pipe(
      map(response => {
        return response.posts.map( post => {
          return  this.transformPostData(post);
        })
      })
    ).subscribe( (posts: Post[]) => {
      this.posts = posts;
      this.postsSubject.next([...this.posts]);
    });
  }

  addPost(postData) {
    this.isLoading.emit(true);
    const formData = new FormData();
    if (postData.content) formData.append("content", postData.content); 
    if (postData.image) {
      formData.append("image",postData.image , postData.image.name);
    }

    this.http.post<{message: string, post: any}>( this.url , formData)
    .pipe(
      map(response => {
        return this.transformPostData(response.post)
      })
    )
    .subscribe(createdPost => {
      this.posts.unshift(createdPost);
      this.postsSubject.next([...this.posts]);
      this.isLoading.emit(false);
    });
  }

  updatePost(id,postData) {
    this.isEditLoading.emit(true);
    const formData = new FormData();
    if (postData.content) {
      formData.append("content", postData.content);
    }
    if (postData.image) {
      formData.append("image",postData.image,postData.image.name);
    }
    
     this.http.put<{message: string, post: any}>( this.url + "/" + id , formData)
      .pipe(
        map( response => {
          return this.transformPostData(response.post);
        })
      ).subscribe((updatedPost: Post) => {
        console.log(updatedPost);
        let index = this.posts.findIndex( (post: Post) => {
          return post.id === updatedPost.id;
        });

        this.posts[index] = updatedPost;
        this.postsSubject.next([...this.posts]);
        this.isEditLoading.emit(false);
      });
  }




  deletePost(id: string) {
    this.http.delete<{message: string, post: any}>(this.url + `/${id}`)
    .pipe(
      map(response => {
        return this.transformPostData(response.post);
      })
    ).subscribe( (deletedPost: Post) => {
      console.log(deletedPost);
      let index = this.posts.findIndex( (post: Post, index) => {
        return post.id === deletedPost.id;
      });
      this.posts.splice(index,1);
      this.postsSubject.next([...this.posts]);
    });
  }


  addLike(postId) {
    this.http.post<{message: string, post: any}>( this.url+ `/likes`, {postId})
    .pipe(
      map( response => {
        return this.transformPostData(response.post);
      })
    ).subscribe( newPost => {
        const oldPostIndex = this.posts.findIndex( post => {
          return post.id === newPost.id;
        });

        this.posts[oldPostIndex].likes = newPost.likes;
        this.postsSubject.next([...this.posts]);

    });
  }

  deleteLike(likedId: string, postId: string) {
    this.httpOptions.body = {postId};
    this.http.delete<{message: string, post:any}>(this.url+ `/likes/${likedId}`, this.httpOptions)
    .pipe(
      map( response => {
        return this.transformPostData(response.post);
      })
    ).subscribe((newPost: Post) => {
      const oldPostIndex = this.posts.findIndex( post => {
        return post.id === newPost.id;
      });

      this.posts[oldPostIndex].likes = newPost.likes;
      this.postsSubject.next([...this.posts]);
    });
  }

  addComment(postId, content) {
    const requestBody = { postId: postId, content: content};
    this.http.post<{message: string, post:any}>(environment.apiUrl + `/api/comments`, requestBody)
      .pipe(
        map( response => {
          return this.transformPostData(response.post);
        })
      ).subscribe((newPost: Post) => {
        const oldPostIndex = this.posts.findIndex( post => {
          return post.id === newPost.id;
        });

        this.posts[oldPostIndex].comments = newPost.comments
        this.postsSubject.next([...this.posts]);
      })
  }


  deleteComment(commentId, postId) {
    this.httpOptions.body = {postId};
    this.http.delete<{message:string, post: any}>( environment.apiUrl + `/api/comments/${commentId}`,
    this.httpOptions)
    .pipe(
      map( response => {
        return this.transformPostData(response.post);
      })
    ).subscribe((newPost: Post) => {
      const oldPostIndex = this.posts.findIndex( post => {
        return post.id === newPost.id;
      });

      this.posts[oldPostIndex].comments = newPost.comments
      this.postsSubject.next([...this.posts]);
    })
  }

  updateComment(commentId, editCommentData) {
    return this.http.put<{message: string, post:any}>(environment.apiUrl+ `/api/comments/${commentId}`, editCommentData)
        .pipe(
          map( (result) => {
            let newPost = this.transformPostData(result.post);
            const oldPostIndex = this.posts.findIndex( post => {
              return post.id === newPost.id;
            });
    
            this.posts[oldPostIndex].comments = newPost.comments
            this.postsSubject.next([...this.posts]);
            return true;
          })
        );
  }

  transformPostData(post): Post {
    const user = this.userService.transformUserData(post.user);
    return {
      id: post._id,
      user: user,
      content: post.content,
      imageUrl: post.imageUrl,
      likes: post.likes,
      comments: post.comments,
      createdAt: post.createdAt
    }
  }

  handleWebSocket(data) {
      // new post created
      if(data.action === 'create') {
        let newPost = this.transformPostData(data.post); 
        if (this.userService.user.id != newPost.user.id && !this.userProfileId) {
          this.posts.unshift(newPost);
          this.postsSubject.next([...this.posts]);
        } else if (this.userProfileId) {
          if (this.userService.user.id != newPost.user.id && this.userProfileId == newPost.user.id) {
            this.posts.unshift(newPost);
            this.postsSubject.next([...this.posts]);
          }
        }
        
        // update post
      } else if(data.action === 'update') {
        this.handleSocketPost(data.post);

        // delete post
      } else if(data.action === 'delete') {
          let deletedPost =this.transformPostData(data.post); 
          let index = this.posts.findIndex( (post) => {
            return post.id === deletedPost.id;
          });
          if (index >= 0 && this.userService.user.id !== deletedPost.user.id) {
            this.posts.splice(index,1);
            this.postsSubject.next([...this.posts]);
          }
      } else if(data.action === 'addLike' || data.action === 'deleteLike') {
        this.handleSocketPost(data.post);

      } else if(data.action === 'addComment' || data.action === 'deleteComment' || data.action === 'editComment') {
        this.handleSocketPost(data.post);
      }
  }

  handleSocketPost(post) {
    let updatedPost =this.transformPostData(post); 
    let index = this.posts.findIndex( (post) => {
      return post.id === updatedPost.id;
    });
    if (index >= 0) {
      this.posts[index] = updatedPost;
      this.postsSubject.next([...this.posts]);
    }
  }



}
