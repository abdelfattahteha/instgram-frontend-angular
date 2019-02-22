import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { User } from "../models/user.model";
import { map } from 'rxjs/operators';
import { Subject, Observable, from } from "rxjs";
@Injectable({
    providedIn: "root"
})

export class UserService {
    private url: string = environment.apiUrl + "/api/users";
    private userSub = new Subject<User>();
    user: User;
    private userProfileSub = new Subject<User>();
    constructor(private http: HttpClient) {}

    initUser(id: string) {
        this.http.get<{user: any}>( this.url + `/${id}`)
        .pipe(
            map(response => {
                return this.transformUserData(response.user);
            })
        ).subscribe( (user: User) => {
            this.user = user;
            this.userSub.next(user);
        });
    }
    getUser(): Observable<User> {
        return this.userSub.asObservable();
    }

    initUserProfile(id: string) {
        this.http.get<{user: any}>( this.url + `/${id}`)
        .pipe(
            map(response => {
                let user = this.transformUserData(response.user);
                return user;
            })
        ).subscribe( (user:User) => {
            this.userProfileSub.next(user);
        });
    }
    getUserProfile(): Observable<User> {
        if (this.userProfileSub) {
            return this.userProfileSub.asObservable();
        } else {
            return from(null);
        }
    }

    changeImage(image) {
        const formData = new FormData();
        formData.append("image", image, image.name);
        return this.http.post<{message: string, user:any}>( this.url + "/image" , 
        formData)
        .pipe(
            map(response => {
                return this.transformUserData(response.user);
            })
        ).subscribe( (user: User) => {
            this.userProfileSub.next(user);
            this.userSub.next(user);
        });;
    }


    transformUserData(user: any): User {
        return {
            id: user._id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            imageUrl: user.imageUrl
        }
    }
}