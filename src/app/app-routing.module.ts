import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainContentComponent } from "./main-content/main-content.component";
import { AuthGaurd } from "./services/auth-gaurd.service";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { ProfileUserResolver } from "./services/resolve-profile-user.service";

const appRoutes: Routes = [
    { path: '' , redirectTo:'home', pathMatch:'full'},
    { path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
    { path: 'home' , component: MainContentComponent, canActivate: [AuthGaurd]},
    { path: 'profile/user/:id', component: MainContentComponent, canActivate: [AuthGaurd], 
    resolve: {profileUser:ProfileUserResolver} },
    { path: 'error/:status', component: ErrorPageComponent},
    { path: '**', redirectTo:'error/404', pathMatch:'full'}
  ];

@NgModule({
    imports: [ RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
    providers: [AuthGaurd, ProfileUserResolver]
})
export class AppRouting {}