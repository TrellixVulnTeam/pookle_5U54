import { Component, OnInit} from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { UniService } from '../../uni.Service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css'],

})

export class LoginRegisterComponent implements OnInit {
  display_grade=true;
  display_grade2=true;
  display_grade3=true;
  id;
  que;
  userData;
  closeResult: string;
  signInForm = this.fb.group({
    user_id: ['',Validators.compose([Validators.required,Validators.pattern('[^ \t\r\n\v\f]*')]) ],
    user_pw: ['', Validators.compose([Validators.required,Validators.pattern('[^ \t\r\n\v\f]*')])],
  });

  signUpForm = this.fb.group({
    user_id: ['', Validators.compose([Validators.required,Validators.pattern('[^ \t\r\n\v\f]*')])],
    user_pw: ['', Validators.compose([Validators.required,Validators.pattern('[^ \t\r\n\v\f]*')])],
    user_pwc: ['', Validators.compose([Validators.required,Validators.pattern('[^ \t\r\n\v\f]*')])],
    user_que: ['', Validators.required],
    user_ans: ['',  Validators.required],
  });
  checkAccountForm = this.fb.group({
    user_id:['', Validators.required]
  });
  checkQuestionForm = this.fb.group({
    user_ans:['', Validators.required]
  });
  resetPasswdForm = this.fb.group({
    pw:['', Validators.pattern('[^ \t\r\n\v\f]*')],
    pwc:['', Validators.pattern('[^ \t\r\n\v\f]*')]
  });


  constructor(private fb: FormBuilder,
    private uniService: UniService,
    private modalService: NgbModal,
    private router: Router,
    private authenticationService: AuthenticationService) {}

  ngOnInit() {
  }
  move(){
    if(this.display_grade == true && this.display_grade2==true && this.display_grade3==true ){
      this.display_grade3 = false;
    }else if(this.display_grade == true && this.display_grade2==true && this.display_grade3==false){
      this.display_grade2=false;
    }else if(this.display_grade == true && this.display_grade2==false && this.display_grade3==false){
      this.display_grade=false;
    }
  }

  open(content) {
    this.checkAccountForm.reset();
    this.checkQuestionForm.reset();
    this.resetPasswdForm.reset();
    this.display_grade=true;
    this.display_grade2=true;
    this.display_grade3=true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }
  close(){
    this.display_grade=true;
    this.display_grade2=true;
    this.display_grade3=true;
    this.modalService.dismissAll();
  }

  signIn(){
    this.userData = {
      user_id: this.signInForm.value.user_id,
      user_pw: this.signInForm.value.user_pw,
    }
    this.uniService.signIn(this.userData).subscribe(
      response => {
        if(response){
          localStorage.setItem('token', response.access_token);
          location.href = "/"; 
        }else{
          alert("???????????? ??????????????? ??????????????????.");
        }
      },
      error => console.log('error', error)
    );
  }

  registerNewUser(){
    this.userData = {
      user_id: this.signUpForm.value.user_id,
      user_pw: this.signUpForm.value.user_pw,
      user_que: this.signUpForm.value.user_que,
      user_ans: this.signUpForm.value.user_ans,
    }
    if(this.userData.user_que){
      this.uniService.registerNewUser(this.userData).subscribe(
        response => {
          if(response == "Duplicate accounts"){
            alert("????????? ???????????????. ?????? ??????????????????.");
          }else{
            alert("????????? ?????????????????????.");
            localStorage.setItem('token', response.access_token);
            location.href = "/"; 
          }
        },
        error => console.log('?????? ????????? !!error', error)
      );
    }else{
      alert("????????? ??????????????????!");
    }
  }
  checkAccount(){
    this.id = this.checkAccountForm.value.user_id;
    this.uniService.checkUserId(this.checkAccountForm.value).subscribe(
      response => {
        if(response){
          this.move();
          this.display_grade3 = false;
          switch(response.que){
            case "1":
              this.que = "?????? ??????????";
              break;
            case "2":
              this.que = "?????? ????????? ??????????";
              break;
            case "3":
              this.que = "?????? ??????????";
              break;
            case "4":
              this.que = "?????? ??????????";
              break;
            case "5":
              this.que = "?????? ?????????????";
              break;
            case "6":
              this.que = "?????? ????????? ??????????";
              break;
            case "7":
              this.que = "?????? ??????????????? ??????";
              break;
          }
        }else{
          alert("?????? ???????????????!");
        }
      },
      error => console.log('?????? ????????? !!error', error)
    );
    this.checkAccountForm.reset();
  }
  checkQuestion(){
    let postData = {
      user_ans:this.checkQuestionForm.value.user_ans,
      user_id:this.id
    }
    this.uniService.checkQueAns(postData).subscribe(
      response => {
        if(response){
          this.move();
          this.display_grade3 = false;
        }else{
          alert("????????? ????????? ????????????!");
        }
      },
      error => console.log('?????? ????????? !!error', error)
    );
    this.checkQuestionForm.reset();
  }
  resetPasswd(){
    let postData = {
      user_id:this.id,
      new_pw:this.resetPasswdForm.value.pw
    }
    if(this.resetPasswdForm.value.pw != this.resetPasswdForm.value.pwc){
      alert("??? ??????????????? ????????????!");
    }else{
      this.uniService.changePasswd(postData).subscribe(
        response => {
          if(response){
            this.move();
            this.display_grade2=false;
          }else{
            alert("?????? ???????????????!");
          }
        },
        error => console.log('?????? ????????? !!error', error)
      );
    }
    this.resetPasswdForm.reset();
  }
  clear(){
    this.signInForm.reset();
    this.signUpForm.reset();
  }
}
