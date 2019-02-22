import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { OAuth } from 'oauthio-web';
import { environment } from 'src/environments/environment';
import { routerNgProbeToken } from '@angular/router/src/router_module';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  backEndValidation: string;
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', {validators:[Validators.required,Validators.email]}),
      password: new FormControl('', [Validators.required])
    });

  }

  submitLogin() {
    if (this.form.invalid) {
      return null;
    }

    this.isLoading = true;
    
    const email = this.form.value.email;
    const password = this.form.value.password;
    this.authService.login(email, password)
      .subscribe( (result:boolean) => {    
            if (result) this.router.navigate(['/home']);
      }, (error) => {
        this.isLoading = false;
        this.backEndValidation = error.error.data[0].msg;
      });

  }

  facebookLogin() {
    OAuth.initialize(environment.OAuthKey);
    let parentScope= this;
    OAuth.popup('facebook').done(function(result) {
      result.me()
        .done(function (response) {
            let loginData = {
              firstname:response.firstname,
              lastname:response.lastname,
              email:response.email
            }

            parentScope.authService.socialLogin(loginData)
            .subscribe( (result:boolean) => {
                  if (result) parentScope.router.navigate(['/home']);
            });
        })
    })
  }

  googleLogin() {
    OAuth.initialize(environment.OAuthKey);
    let parentScope= this;
    OAuth.popup('google').done(function(result) {
      result.me()
      .done(function (response) {
        let loginData = {
          firstname:response.raw.names[0].givenName,
          lastname:response.raw.names[0].familyName,
          email:response.email
        }

        parentScope.authService.socialLogin(loginData)
          .subscribe( (result:boolean) => {  
              if (result) parentScope.router.navigate(['/home']);
          });
      })
  })
  }
}
