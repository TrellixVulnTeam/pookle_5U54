import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { UniService } from '../uni.Service';
import { HostListener } from '@angular/core';

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
  is_auth:boolean;
  posts;
  user;
  small_posts;
  maxPost=13;
  writeForm = this.fb.group({
    contents: ['', Validators.required]
  });
  comment_writeForm = this.fb.group({
    contents: ['',  Validators.required]
  });
  updateForm = this.fb.group({
    contents: ['', Validators.required],
    id:['']
  })
  constructor(private modalService: NgbModal, private fb: FormBuilder,
    private uniService: UniService) { 
      this.isCollapsed = [];

      this.getList();

    }

  ngOnInit() {
    if(localStorage.getItem('token')){
      this.is_auth=true;
    }else{
      this.is_auth=false;
    }
  }
  @HostListener('window:scroll', ['$event']) onScrollEvent($event){
    let pageHeight=document.documentElement.offsetHeight;
    let windowHeight=window.innerHeight+3;
    if(window.pageYOffset+windowHeight>=pageHeight){
      this.maxPost+=5;
      this.small_posts = this.posts.slice(0,this.maxPost+5);
    }
  }
  write(content){
    this.writeForm.reset();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      
    }, (reason) => {
    });
  }
  update_post(i,update){
    this.updateForm.setValue({
      contents:this.posts[i].contents,
      id:this.posts[i]._id.$oid
    });
    this.modalService.open(update, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      
    }, (reason) => {
    });
  }
  save(){
    this.uniService.updatePost(this.updateForm.value).subscribe(
      response => {
        this.getList();
      },
      error => console.log('error',error)
    );
    this.modalService.dismissAll();
  }

  collapsed(ind:number){
    this.isCollapsed[ind] = !this.isCollapsed[ind];
    this.comment_writeForm.reset();

  }
  
  close(){
    this.modalService.dismissAll();
  }

  send(){
    if(this.writeForm.value.contents.length >500){
      alert("최대 500자까지 작성할 수 있습니다.")
    }else{
      this.uniService.sendPost(this.writeForm.value).subscribe(
        response => {
          if(!response){
            alert("비속어를 사용하지 마세요!");
          }
          this.getList();
        },
        error => console.log('error',error)
      );
      this.modalService.dismissAll();
    }
  }

  comment_send(ind:number){
    if(this.is_auth){
      this.uniService.sendComment(this.comment_writeForm.value, this.posts[ind]._id.$oid).subscribe(
        response => {
          this.getList();
        },
        error => console.log('error',error)
      );
    }else{
      alert("로그인이 필요합니다.");
    }
    this.comment_writeForm.reset();

  }
  delete_comment(post_ind:number, comment_ind){
    let postData = {
      post_id:this.posts[post_ind]._id.$oid,
      comment_id:this.posts[post_ind].comment[comment_ind].oid.$oid
    }
    this.uniService.deleteComment(postData).subscribe(
      response => {
        this.getList();
      },
      error => console.log('error',error)
    );
  }
  delete_post(post_ind:number){
    this.uniService.deletePost(this.posts[post_ind]._id.$oid).subscribe(
      response => {
        this.getList();
      },
      error => console.log('error',error)
    );
  }
  getList(){
    this.uniService.getUserDetail().subscribe(
      response => {
        if(response){
          this.user = {
            user_id:response._id,
            user_uid:response.id,
            user_rank:response.rank,
            user_nick:response.nickname
          }
          if(this.user.user_rank==10){
            this.isAdmin=true;
          }
        }

        this.uniService.getBoardList().subscribe(
          response => {
            this.posts = JSON.parse(response);
            let post_len = this.posts.length;
            let comment_len;
            this.isFavorite= [];

            for(let i=0;i<post_len;i++){
              comment_len = this.posts[i].comment.length;
              this.posts[i].comment.reverse();
              this.posts[i].date = this.timeConverter(this.posts[i].date);
              this.isFavorite[i]= false;
              if(this.isCollapsed[i] == null)
                this.isCollapsed[i] = true;
              for(let j=0;j<comment_len;j++){
                this.posts[i].comment[j].date = this.timeConverter(this.posts[i].comment[j].date);
              }
              this.posts[i].show_comment = this.posts[i].comment.slice(0,8);
              let show_comment_len = this.posts[i].show_comment.length;
              if(comment_len> show_comment_len){
                this.posts[i].more_comment = true;
              }else{
                this.posts[i].more_comment = false;
              }
              if(this.posts[i].fav){
                let fav_len = this.posts[i].fav.length;
                if(this.user)
                for(let j=0;j<fav_len;j++){
                  if(this.posts[i].fav[j].user_id.$oid == this.user.user_id.$oid){
                    this.isFavorite[i]= true;
                  }
                
                }
              }
            }
            this.small_posts = this.posts.slice(0,this.maxPost);
          },
          error => console.log('error', error)
        );
    },
      error => console.log('이건 에러야 !!error', error)
    );
   
  }
  more_comments(i){
    let show_comment_len = this.posts[i].show_comment.length;
    let comment_len = this.posts[i].comment.length;
    this.posts[i].show_comment = this.posts[i].comment.slice(0,show_comment_len+5);
    show_comment_len = this.posts[i].show_comment.length;
    if(comment_len<= show_comment_len){
      this.posts[i].more_comment = false;
    }else{
      this.posts[i].more_comment = true;
    }
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
  timeConverter(UNIX_timestamp:any){
    UNIX_timestamp = UNIX_timestamp.replace(/[^0-9]/g,"");
    let year:number = UNIX_timestamp.substring(0,4);
    let month:number = UNIX_timestamp.substring(4,6)-1;
    let day:number = UNIX_timestamp.substring(6,8);
    let hour:number = UNIX_timestamp.substring(8,10);
    let min:number = UNIX_timestamp.substring(10,12);
    let sec:number = UNIX_timestamp.substring(12,14);
    let date = new Date(year, month, day, hour, min,sec);

    let now = Math.round(new Date().getTime());
    let elapsed_time = (now-date.getTime())/1000;
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
