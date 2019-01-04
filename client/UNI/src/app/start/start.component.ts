import { Component, OnInit } from '@angular/core';
import { User } from '../user/user';
import { FormBuilder, Validators } from '@angular/forms';
import { UniService } from '../uni.Service';
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'start',
  templateUrl: '/index.html',
  styleUrls: ['./start.component.css',
              './css/agency.css',
              './css/agency.min.css'
]
})


export class StartComponent implements OnInit {
  userData;
  is_auth:boolean;
  signUpForm = this.fb.group({
    id: ['',Validators.compose([Validators.required,Validators.pattern('[^ \t\r\n\v\f]*')])],
    pw: ['',Validators.compose([Validators.required,Validators.pattern('[^ \t\r\n\v\f]*')])],
    pwc: ['',Validators.compose([Validators.required,Validators.pattern('[^ \t\r\n\v\f]*')])],
    email: ['',Validators.compose([Validators.required,Validators.pattern('[^ \t\r\n\v\f]*')])],
  });
  model:User;
  ngOnInit() {
    this.signUpForm.reset();
    if(localStorage.getItem('token')){
      this.is_auth=true;
    }else{
      this.is_auth=false;
    }
  }
  registerUser(){
    this.userData = {
      username: this.signUpForm.value.id,
      password: this.signUpForm.value.pw,
      email: 'asdf@naver.com'
    }
    this.uniService.registerNewUser(this.userData).subscribe(
      response => {
        alert('가입되었습니다.');
        this.router.navigate(['user/sign-in']);
      },
      error => console.log('error', error)
    );
  }
  constructor(private fb: FormBuilder,
              private uniService: UniService,
              private router: Router) { 
  }
}
