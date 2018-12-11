import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UniService } from '../../../uni.Service';

@Component({
  selector: 'edit-nickname',
  templateUrl: './edit-nickname.component.html',
  styleUrls: ['./edit-nickname.component.css']
})
export class EditNicknameComponent implements OnInit {
  editNicknameForm = this.fb.group({
    nickname: ['']
  });
  constructor(private fb: FormBuilder,
    private uniService: UniService) { }

  ngOnInit() {
  }
  edit(){
    console.log(this.editNicknameForm.value);
  }

}
