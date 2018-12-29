import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './start/start.component';
import { TimelineComponent } from './timeline/timeline.component';
import { BoardComponent } from './board/board.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { SettingComponent } from './user/setting/setting.component';
import { StatsComponent } from './stats/stats.component';
import { LoginRegisterComponent } from './user/login-register/login-register.component';
import { FindAccountComponent } from './user/find-account/find-account.component';
import { UserlistComponent } from './user/userlist/userlist.component';
import { MyPageComponent } from './user/my-page/my-page.component';
import { ChangePasswordComponent } from './user/my-page/change-password/change-password.component';
import { EditNicknameComponent } from './user/my-page/edit-nickname/edit-nickname.component';
import { FavPostComponent } from './user/my-page/fav-post/fav-post.component';
import { FavTagComponent } from './user/my-page/fav-tag/fav-tag.component';
import { MyPageHomeComponent } from './user/my-page/my-page-home/my-page-home.component';

const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'timeline', component: TimelineComponent},
  { path: 'timeline/:word', component: TimelineComponent},
  { path: 'board', component: BoardComponent},
  { path: 'user/sign-in', component: LoginRegisterComponent},
  { path: 'user/my-page', component: MyPageComponent,
    children: [
      {path: '', component:MyPageHomeComponent },
      {path: 'change-password', component: ChangePasswordComponent},
      {path: 'edit-nickname', component: EditNicknameComponent},
      {path: 'fav-post', component: FavPostComponent},
      {path: 'fav-tag', component: FavTagComponent},
    ]
  },
  { path: 'user/find-account', component: FindAccountComponent},
  { path: 'user/userlist', component: UserlistComponent},
  { path: 'stats', component: StatsComponent},

];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes, {useHash: true}) ],

})
export class UniRoutingModule { }

