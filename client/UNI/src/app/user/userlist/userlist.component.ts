import { Component, OnInit } from '@angular/core';
import { UniService } from '../../uni.Service'

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  users;
  user;
  isAdmin:boolean=false;
  constructor(
    private uniService: UniService,) { 
     }

  ngOnInit() {
    this.uniService.getUserDetail().subscribe(
      response => {
       if(!response || response.rank!=10){
          alert("잘못된 접근입니다!");
          location.href = "/#/";
      }else{
        this.uniService.loadUserList().subscribe(
          response =>{
            this.users=JSON.parse(response);
          },
          error => console.log('error', error)
        );
      }
      },
      error => console.log('이건 에러야 !!error', error)

    );
    
  }

}
