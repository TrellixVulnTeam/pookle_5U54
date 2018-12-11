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

   }

}
