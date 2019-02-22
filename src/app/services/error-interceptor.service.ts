import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router:Router, private authService: AuthService){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
      return next.handle(req).pipe(
          catchError( (error: HttpErrorResponse) => {
              if (error.status === 404) {
                this.router.navigate(['/error',404]);
              } else if (error.status === 500) {
                this.router.navigate(['/error',500]);
              } else if (error.status === 401) {
                let token = this.authService.getToken();
                if(token) {
                    this.authService.logout();
                }
                this.router.navigate(['/auth/login']);
              }


              return throwError(error);
          })
      );
    }
}