import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { Post } from 'src/app/models/post.model';
import { FormGroup, FormControl } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { mimeType } from '../create-post/mime-type-validator';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  oldPost: Post;
  form: FormGroup;
  imagePreviewUrl;
  isLoadingSub: Subscription;
  isLoading:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<EditPostComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,private postService: PostService) { }

  ngOnInit() {
    this.oldPost = this.data.post;
    this.form = new FormGroup({
      content: new FormControl(this.oldPost.content || ''),
      image: new FormControl(null, {asyncValidators: mimeType})
    });
    if (this.oldPost.imageUrl) {
      this.imagePreviewUrl = this.oldPost.imageUrl;
    }

    this.data.isLoadingSub = this.postService.isEditLoading.subscribe(result => {
      this.isLoading = result;
      if (!result) {
        this.form.reset();
        this.dialogRef.close();
      }
    })

  }

  uploadImage(event: Event) {
    
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (this.form.get('image').valid) {
        this.imagePreviewUrl = fileReader.result;
      }
    }
    fileReader.readAsDataURL(file);
    
  }

  updatePost() {
    this.isLoading = true;
    const content = this.form.value.content || undefined;
    const image = this.form.value.image || undefined; 
    let postData = {content: content, image:image};
    this.postService.updatePost(this.oldPost.id,postData);
  }

  
}
