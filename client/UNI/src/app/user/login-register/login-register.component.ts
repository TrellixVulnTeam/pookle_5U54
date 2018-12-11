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
    account:['']
  });
  checkQuestionForm = this.fb.group({
    answer:['']
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
  }
  checkAccount(){
    this.display_grade3 = false;
    console.log(this.checkAccountForm.value);
  }
  checkQuestion(){
    this.display_grade2=false;
    console.log(this.checkQuestionForm.value);
  }
  resetPasswd(){
    this.display_grade=false;
    console.log(this.resetPasswdForm.value);
  }
}
