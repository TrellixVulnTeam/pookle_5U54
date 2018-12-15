import { Component, OnInit} from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
    user_id: [''],
    user_pw: [''],
  });

  signUpForm = this.fb.group({
    user_id: [''],
    user_pw: [''],
    user_pwc: [''],
    user_que: [''],
    user_ans: [''],
  });
  checkAccountForm = this.fb.group({
    user_id:['']
  });
  checkQuestionForm = this.fb.group({
    user_ans:['']
  });
  resetPasswdForm = this.fb.group({
    pw:[''],
    pwc:['']
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
          location.href = "/timeline"; 
        }else{
          alert("아이디나 패스워드를 확인해주세요.");
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
            alert("중복된 계정입니다. 다시 입력해주세요.");
          }else{
            alert("가입이 완료되었습니다.");
            localStorage.setItem('token', response.access_token);
            location.href = "/timeline"; 
          }
        },
        error => console.log('이건 에러야 !!error', error)
      );
    }else{
      alert("질문을 선택해주세요!");
    }
  }
  checkAccount(){
    this.id = this.checkAccountForm.value.user_id;
    console.log(this.checkAccountForm.value);
    this.uniService.checkUserId(this.checkAccountForm.value).subscribe(
      response => {
        if(response){
          this.move();
          this.display_grade3 = false;
          switch(response.que){
            case "1":
              this.que = "나의 학과는?";
              break;
            case "2":
              this.que = "나의 어머니 성함은?";
              break;
            case "3":
              this.que = "나의 고향은?";
              break;
            case "4":
              this.que = "나의 취미는?";
              break;
            case "5":
              this.que = "나의 첫사랑은?";
              break;
            case "6":
              this.que = "나의 아버지 성함은?";
              break;
            case "7":
              this.que = "나의 라임오렌지 나무";
              break;
          }
        }else{
          alert("없는 계정입니다!");
        }
      },
      error => console.log('이건 에러야 !!error', error)
    );
    this.checkAccountForm.reset();
  }
  checkQuestion(){
    let postData = {
      user_ans:this.checkQuestionForm.value.user_ans,
      user_id:this.id
    }
    console.log(postData.user_id);
    this.uniService.checkQueAns(postData).subscribe(
      response => {
        console.log(response);
        if(response){
          this.move();
          this.display_grade3 = false;
        }else{
          alert("질문의 답변이 다릅니다!");
        }
      },
      error => console.log('이건 에러야 !!error', error)
    );
    this.checkQuestionForm.reset();
  }
  resetPasswd(){
    let postData = {
      user_id:this.id,
      new_pw:this.resetPasswdForm.value.pw
    }
    if(this.resetPasswdForm.value.pw != this.resetPasswdForm.value.pwc){
      alert("두 비밀번호가 다릅니다!");
    }else{
      this.uniService.changePasswd(postData).subscribe(
        response => {
          if(response){
            this.move();
            this.display_grade2=false;
          }else{
            alert("없는 계정입니다!");
          }
        },
        error => console.log('이건 에러야 !!error', error)
      );
    }
    this.resetPasswdForm.reset();
  }
}
