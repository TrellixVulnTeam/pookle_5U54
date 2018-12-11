import { Component, OnInit } from '@angular/core';
import { UniService } from '../../uni.Service'

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  users;
  constructor(
    private uniService: UniService,) { 
      this.uniService.loadUserList().subscribe(
      response =>{
        this.users=JSON.parse(response);
      },
      error => console.log('error', error)
    );}

  ngOnInit() {
  }

}
