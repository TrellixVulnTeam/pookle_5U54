import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UniService } from '../../uni.Service';
@Component({
  selector: 'start-sign-up',
  templateUrl: './start-sign-up.component.html',
  styleUrls: ['./start-sign-up.component.css']
})
export class StartSignUpComponent implements OnInit {
  userData;
  signUpForm = this.fb.group({
    user_id: ['',Validators.compose([Validators.required,Validators.pattern('[^ \t\r\n\v\f]*')])],
    user_pw: ['',Validators.compose([Validators.required,Validators.pattern('[^ \t\r\n\v\f]*')])],
    user_pwc: ['',Validators.compose([Validators.required,Validators.pattern('[^ \t\r\n\v\f]*')])],
    user_que: ['',Validators.required],
    user_ans: ['',Validators.required],
  });
  constructor(private fb: FormBuilder,
    private uniService: UniService,) { 
    }

  ngOnInit() {
    this.signUpForm.reset();
  }

  registerNewUser(){
    if(!this.signUpForm.valid){
      alert("모든 정보를 입력해 주세요!");
      
    }else{
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
          location.href = "/#/timeline"; 
        }
      },
      error => console.log('이건 에러야 !!error', error)
    );
    }
  }

}
