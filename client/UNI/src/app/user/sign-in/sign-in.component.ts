import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UniService } from '../../uni.Service';
@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  userData;
  signInForm = this.fb.group({
    id: [''],
    pw: [''],
  });
  constructor(private fb: FormBuilder,
    private uniService: UniService,) {}

  ngOnInit() {
  }

  signIn(){
    this.userData = {
      username: this.signInForm.value.id,
      password: this.signInForm.value.pw,
      email: 'asdf@naver.com'
    }
    this.uniService.signIn(this.userData).subscribe(
      response => {

      },
      error => console.log('error', error)
    );
  }

}
