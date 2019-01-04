import { Component } from '@angular/core';
import { UniService } from './uni.Service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  is_auth:boolean;

  constructor(private uniService: UniService,) {
    if(this.uniService.is_auth()){
      this.is_auth = true;
    }else{
      this.is_auth = false;
    }
    var agent = navigator.userAgent.toLowerCase();
    if(agent.indexOf('MSIE')!=-1 || agent.indexOf('rv:')!=-1)
      alert("인터넷 익스플로러의 경우 일부 기능이 동작하지 않을 수 있습니다.")
  }

}
