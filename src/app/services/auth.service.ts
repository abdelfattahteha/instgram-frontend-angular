import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { User } from "../models/user.model";
import { map } from "rxjs/operators";
import * as jwt_decode from "jwt-decode";
import { UserService } from "./user.service";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private url: string = environment.apiUrl + "/api/auth";
    private isLogged = false;

    constructor(private http: HttpClient, private userService: UserService) {}


    login(email: string, password: string) {
        const loginData = {email: email, password: password};
        return this.http.post<{token: string, user:any}>(this.url+"/login",loginData)
        .pipe(
            map( response => {
                this.setToken(response.token);
                this.isLogged = true;
                return true; 
            })
        );
    }

    signup(signupData: any) {
        return this.http
            .post<{message:string ,token:string,user:any}>( this.url+"/signup" , signupData)
            .pipe(
                map( response => {
                    this.setToken(response.token);
                    this.isLogged = true;
                    return true;
                })
            );
    }

    checkEmail(email:string) {
        return this.http.get<{emailExist:boolean}>(this.url+ `/checkemail/${email}`);
    }

    socialLogin(loginData: any) {
        return this.http.post<{token: string, user:any}>(this.url+"/social-login",loginData)
        .pipe(
            map( response => {
                this.setToken(response.token);
                this.isLogged = true;
                return true; 
            })
        );
    }

    logout() {
        localStorage.removeItem('token');
        this.isLogged = false;
        return true;
    }

    // return true if loggedIn or false to AuthGaurd
    checkAuth() {
        let token = this.getToken();
        if (!token) {
            return null;
        }

        this.isLogged = true;
        let userId = jwt_decode(token).userId;
        this.userService.initUser(userId);
        return true;

    }


    isLoggedIn() {
        return this.isLogged;
    }


    private setToken(token: string) {
        localStorage.setItem('token', token);
    }
    getToken(): string {
        const token = localStorage.getItem('token');
        if (token) {
            return token;
        } else {
            return null;
        }
    }


}