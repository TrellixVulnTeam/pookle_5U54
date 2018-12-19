import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { StartComponent } from './start/start.component';
import { UniRoutingModule } from './/uni-routing.module';
import { TimelineComponent } from './timeline/timeline.component';
import { BoardComponent } from './board/board.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { SettingComponent } from './user/setting/setting.component';
import { StatsComponent } from './stats/stats.component';
import { ConfigComponent } from './config/config.component';
import { HeaderComponent } from './header/header.component';
import { LoginRegisterComponent } from './user/login-register/login-register.component';
import { StartSignUpComponent } from './user/start-sign-up/start-sign-up.component';
import { FindAccountComponent } from './user/find-account/find-account.component';
import { UserlistComponent } from './user/userlist/userlist.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyPageComponent } from './user/my-page/my-page.component';
import { ChangePasswordComponent } from './user/my-page/change-password/change-password.component';
import { EditNicknameComponent } from './user/my-page/edit-nickname/edit-nickname.component';
import { FavPostComponent } from './user/my-page/fav-post/fav-post.component';
import { FavTagComponent } from './user/my-page/fav-tag/fav-tag.component';
import { MyPageHomeComponent } from './user/my-page/my-page-home/my-page-home.component';
import { ProfileComponent } from './user/my-page/profile/profile.component';
import { TimelineFavComponent } from './user/my-page/timeline-fav/timeline-fav.component';
import { BoardFavComponent } from './user/my-page/board-fav/board-fav.component';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { SearchTimelineComponent } from './search-timeline/search-timeline.component';
import { BlacklistComponent } from './user/my-page/blacklist/blacklist.component';


@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    TimelineComponent,
    BoardComponent,
    SignInComponent,
    SettingComponent,
    StatsComponent,
    ConfigComponent,
    HeaderComponent,
    LoginRegisterComponent,
    StartSignUpComponent,
    FindAccountComponent,
    UserlistComponent,
    MyPageComponent,
    ChangePasswordComponent,
    EditNicknameComponent,
    FavPostComponent,
    FavTagComponent,
    MyPageHomeComponent,
    ProfileComponent,
    TimelineFavComponent,
    BoardFavComponent,
    SearchTimelineComponent,
    BlacklistComponent
  ],
  imports: [
    BrowserModule,
    UniRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
