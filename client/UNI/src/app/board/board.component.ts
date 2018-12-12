import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { UniService } from '../uni.Service';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  isCollapsed:Array<boolean>;
  closeResult: string;
  isFavorite:Array<boolean>;
  isAdmin:boolean;
  posts;
  writeForm = this.fb.group({
    contents: ['']
  });
  comment_writeForm = this.fb.group({
    contents: ['']
  });
  constructor(private modalService: NgbModal, private fb: FormBuilder,
    private uniService: UniService) { 
      this.getList();
    }

  ngOnInit() {

  }
  write(content){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    });
  }

  collapsed(ind:number){
    this.isCollapsed[ind] = !this.isCollapsed[ind];
  }
  
  close(){
    this.modalService.dismissAll();
  }

  send(){
    this.uniService.sendPost(this.writeForm.value).subscribe(
      response => {
        this.getList();
      },
      error => console.log('error',error)
    );
    this.modalService.dismissAll();
  }

  comment_send(ind:number){
    this.uniService.sendComment(this.comment_writeForm.value, this.posts[ind]._id.$oid).subscribe(
      response => {
        this.getList();
      },
      error => console.log('error',error)
    );
  }
  delete_comment(post_ind:number, comment_ind){
    let postData = {
      post_id:this.posts[post_ind]._id.$oid,
      comment_id:this.posts[post_ind].comment[comment_ind]._id.$oid
    }
    this.uniService.deleteComment(postData).subscribe(
      response => {
        this.getList();
      },
      error => console.log('error',error)
    );
  }
  getList(){
    let user;
    this.uniService.getUserDetail().subscribe(
      response => {
        if(user){
          user = {
            user_id:response._id,
            user_rank:response._rank
          }
          if(user.user_rank==10){
            this.isAdmin=true;
          }
        }
    },
      error => console.log('이건 에러야 !!error', error)
    );
    this.uniService.getBoardList().subscribe(
      response => {
        this.posts = JSON.parse(response);
        let post_len = this.posts.length;
        let comment_len;
        this.isFavorite= [];
        this.isCollapsed=[];
        for(let i=0;i<post_len;i++){
          comment_len = this.posts[i].comment.length;
          this.posts[i].date = this.timeConverter(this.posts[i].date.$date);
          this.isFavorite[i]= false;
          this.isCollapsed[i] =true;
          for(let j=0;j<comment_len;j++){
            this.posts[i].comment[j].date = this.timeConverter(this.posts[i].comment[j].date.$date);
          }
          if(this.posts[i].fav){
            let fav_len = this.posts[i].fav.length;
            for(let j=0;j<fav_len;j++){
              if(this.posts[i].fav[j].user_id.$oid == user.user_id.$oid){
                this.isFavorite[i]= true;
              }
            }
          }
        }
      },
      error => console.log('error', error)
    );
  }

  favorite(ind : number){

    if(localStorage.getItem('token')){
      let id = this.posts[ind]._id;
      if(this.isFavorite[ind]){
        this.uniService.unFavBoard(id).subscribe(
          response => {
            this.posts[ind].fav_cnt-=1;
          },
          error => console.log('error', error)
        );
      }else{
        this.uniService.favBoard(id).subscribe(
          response => {
            this.posts[ind].fav_cnt+=1;
          },
          error => console.log('error', error)
        );
      }
      this.isFavorite[ind] = !this.isFavorite[ind];
    }else{
      alert("관심 기능은 로그인 후에 사용가능합니다.")
    }
    
    
  }
  timeConverter(UNIX_timestamp){
    let now = Math.round(new Date().getTime());
    let elapsed_time = (now-UNIX_timestamp)/1000;
    if(elapsed_time>=2592000){
      elapsed_time /= 2592000;
      return Math.floor(elapsed_time)+"개월 전";
    }else if(elapsed_time>=86400){
      elapsed_time /= 86400;
      return Math.floor(elapsed_time)+"일 전";
    }else if(elapsed_time>=3600){
      elapsed_time /= 3600;
      return Math.floor(elapsed_time)+"시간 전";
    }else if(elapsed_time>=300){
      elapsed_time /=60;
      return Math.floor(elapsed_time)+"분 전";
    }else{
      return "방금 전";
    }
  }

}
