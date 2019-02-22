import { NgModule } from "@angular/core";
import { UserDetailsComponent } from "./user-details/user-details.component";
import { MainContentComponent } from "./main-content.component";
import { PostsSectionComponent } from "./posts-section/posts-section.component";
import { CreatePostComponent } from "./create-post/create-post.component";
import { PostsListComponent } from "./posts-list/posts-list.component";
import { EditPostComponent } from "./edit-post/edit-post.component";
import { TransformUsername } from "../username.pipe";
import { TimeAgoPipe } from "time-ago-pipe";
import { CommonModule } from "@angular/common";
import { AppMaterial } from "../material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

@NgModule({
    declarations: [
        UserDetailsComponent,
        MainContentComponent,
        PostsSectionComponent,
        CreatePostComponent,
        PostsListComponent,
        EditPostComponent,
        TransformUsername,
        TimeAgoPipe
    ],
    entryComponents: [
        EditPostComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterial
    ],
    exports: [
        TransformUsername,
        AppMaterial
    ]
})
export class MainContentModule {}