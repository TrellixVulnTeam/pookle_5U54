import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UniService } from '../../../uni.Service';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  check:boolean = false;
  pwCheckForm = this.fb.group({
    pw: ['']
  });
  pwChangeForm = this.fb.group({
    pw: [''],
    pwc: ['']
  });
  constructor(private fb: FormBuilder,
    private uniService: UniService) { }

  ngOnInit() {
  }
  pw_check(){
    console.log(this.pwCheckForm.value);
  }
  pw_change(){
    
  }

}
