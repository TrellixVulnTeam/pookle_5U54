import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { UniService } from '../../../uni.Service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() data;
  @Output() nickname:EventEmitter<any> = new EventEmitter();

  nicknameForm = this.fb.group({
    nickname:['', Validators.required]
  })
  passwdChangeForm = this.fb.group({
    old_pw:['', Validators.required, Validators.pattern('^[^ \t\r\n\v\f]$')],
    new_pw:['', Validators.required],
    new_pwc:['', Validators.required],
  })
  constructor(private modalService: NgbModal, private fb: FormBuilder,
    private uniService: UniService) { 
  }

  ngOnInit() {
  }
  logout(){
    localStorage.removeItem('token');
    location.href = "/";
  }
  editNick(content){
    this.nicknameForm.reset();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    });
  }

  edit(){
    this.uniService.editNick(this.nicknameForm.value).subscribe(
      response => {
        alert("변경되었습니다.");
        this.close();
        this.nickname.emit('');
      },
      error => console.log('error',error)
    );
    this.modalService.dismissAll();
  }
  change(){
    this.uniService.changePasswd(this.passwdChangeForm.value).subscribe(
      response => {
        if(response == "fail"){
          alert("기존의 암호가 일치하지 않습니다.");
          this.close();
        }else{
          alert("변경되었습니다.");
          this.close();
        }
      },
      error => console.log('error',error)
    );
    this.modalService.dismissAll();
  }
  
  changePasswd(content){
    this.passwdChangeForm.reset();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    });
  }

  close(){
    this.modalService.dismissAll();
  }


}
