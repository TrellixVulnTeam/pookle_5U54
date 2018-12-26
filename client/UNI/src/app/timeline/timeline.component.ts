import { Component, OnInit } from '@angular/core';
import { UniService } from '../uni.Service';
import { FormBuilder } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { HostListener } from '@angular/core';
import { NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router';
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  isFavorite:Array<boolean>;
  posts;
  small_posts;
  admin_post;
  advertise_post;
  is_auth:boolean;
  isAdmin:boolean;
  isFull:boolean = false;
  search_word;
  postData;
  maxPost=20;
  user;
  isCollapsed = false;
  isCategory = true;
  writeForm = this.fb.group({
    title:[''],
    contents: ['']
  });
  advertiseForm = this.fb.group({
    title:[''],
    contents: [''],
    url:[''],
    img:[''],
    date:['']
  });
  constructor(private modalService: NgbModal,
    private fb: FormBuilder, 
    private uniService: UniService,
    private route: ActivatedRoute,
     private router: Router,) { 

       if(window.innerWidth>=992){
        this.isCategory=false;
      }else{
        this.isCategory=true;
      }

      

  }

  ngOnInit() {
    if(localStorage.getItem('token')){
      this.is_auth=true;
    }else{
      this.is_auth=false;
    }       
    this.getAdvertise();
    this.getAdminPost();
    this.getList();
    
  }

  @HostListener('window:scroll', ['$event']) onScrollEvent($event){
    let pageHeight=document.documentElement.offsetHeight
    let windowHeight=window.innerHeight
    if(window.pageYOffset+windowHeight>=pageHeight){
      this.maxPost+=5;
      this.small_posts = this.posts.slice(0,this.maxPost+5);
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(window.innerWidth>=992){
      this.isCategory=false;
    }else{
      this.isCategory=true;
    }
  }
  copyMessage(val: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
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
  favorite(ind : number){

    if(localStorage.getItem('token')){
      let postData = {
        id:this.posts[ind]._id.$oid,
        title:this.posts[ind].title,
        date:this.posts[ind].date
      }
      if(this.isFavorite[ind]){
        this.uniService.unFavTimeline(postData).subscribe(
          response => {
            this.posts[ind].fav_cnt-=1;
          },
          error => console.log('error', error)
        );
      }else{
        this.uniService.favTimeline(postData).subscribe(
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
  write(content){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    });
  }
  send(){
    console.log(this.writeForm.value);
    this.uniService.writePost(this.writeForm.value).subscribe(
      response => {
        this.getList();
      },
      error => console.log('error',error)
    );
    this.modalService.dismissAll();
  }

  adv_send(files: FileList){
    this.uniService.writeAdvertise(this.advertiseForm.value).subscribe(
      response => {
        this.getList();
      },
      error => console.log('error',error)
    );
    this.modalService.dismissAll();
  }

  close(){
    this.modalService.dismissAll();
  }

  removePost(ind : number){
    if(this.isAdmin){
      let id = this.posts[ind]._id;
      this.uniService.removePost(id).subscribe(
        response => {
          this.getList();
        },
        error=>console.log('error',error)
      );
    }
  }

  getAdvertise(){
    this.uniService.getAdvertise().subscribe(
      response => {
        this.advertise_post = JSON.parse(response);
        console.log(this.advertise_post);
        this.getList();
      },
      error => console.log('error',error)
    );
  }


  getAdminPost(){
    this.uniService.getAdminPost().subscribe(
      response => {
          this.admin_post = JSON.parse(response);
          this.admin_post.isFull = true;
          this.admin_post.date = this.timeConverter(this.admin_post.date);
          if(this.admin_post.post.length>175 && !this.isFull){
            this.admin_post.post= this.admin_post.post.slice(0,175);
            this.admin_post.isFull = false;
          }
      },
      error => console.log('이건 에러야 !!error', error)
    );
  }
  fullPost(){
    this.isFull =!this.isFull;
    this.getAdminPost();
  }

  getList(option:number=0){
    window.scrollTo(0, 0);
    this.posts='';
    if(window.location.pathname=='/timeline' || option >=1){
      this.router.navigate(['/timeline/']);
      if(localStorage.getItem('token')){
      this.uniService.getUserDetail().subscribe(
        response => {
            this.user = {
              user_id:response._id,
              user_rank:response.rank
        }
        if(this.user.user_rank==10){
          this.isAdmin=true;
        }
        },
        error => console.log('이건 에러야 !!error', error)

      );
    }
    this.uniService.getTimelineList(option).subscribe(
      response => {
        this.posts = JSON.parse(response);
        let len = this.posts.length;
        this.isFavorite= [];
        for(let i=0;i<len;i++){
          if(this.posts[i].post == 0){
            this.posts[i].post = "[System]해당 사이트 로그인 후에 열람가능합니다.";
          }else if(this.posts[i].post == 1 || this.posts[i].post == ""){
            this.posts[i].post = "[System]링크를 눌러서 확인해보세요!"
          }
          this.posts[i].date = this.timeConverter(this.posts[i].date);
          this.isFavorite[i]= false;
          if(this.posts[i].fav_cnt>=10000){
            this.posts[i].fav_cnt-=10000;
            this.posts[i].admin = true;
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
  

}else{
  this.searchList();
}
}
  searchList(){
    this.route.params.subscribe(params => {
      this.search_word = params['word']; 
    });
    let user;
        if(localStorage.getItem('token')){
          
          this.uniService.getUserDetail().subscribe(
            response => {
                user = {
                  user_id:response._id,
                  user_rank:response.rank
             }
             if(user.user_rank==10){
              this.isAdmin=true;
            }
            },
            error => console.log('이건 에러야 !!error', error)
      
          );
        }
    this.postData={
      word:this.search_word
    }
    this.uniService.search(this.postData).subscribe(
      response => {
        this.posts = JSON.parse(response);
        let len = this.posts.length;
        this.isFavorite= [];
        for(let i=0;i<len;i++){
          this.posts[i].date = this.timeConverter(this.posts[i].date);
          this.isFavorite[i]= false;
          if(this.posts[i].fav){
            let fav_len = this.posts[i].fav.length;
            for(let j=0;j<fav_len;j++){
              if(this.posts[i].fav[j].user_id.$oid == user.user_id.$oid){
                this.isFavorite[i]= true;
              }
            }
          }

        }
        this.small_posts = this.posts.slice(0,this.maxPost);
        
      },
      error => console.log('error',error)
    );
  
  }


    /*var a = new Date(UNIX_timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;*/
  
  addFavTag(post_index, tag_index){
    if(localStorage.getItem('token')){
      alert("관심태그에 추가되었습니다!");
      let fav_tag = {'fav_tag':this.posts[post_index].tag[tag_index]};
      this.uniService.addFavTag(fav_tag).subscribe(
        response =>{},
        error => console.log('error', error)
      );
    }else{
      alert("태그를 저장하는 기능입니다. 로그인 후에 사용가능합니다.")
    }
  }
  addBlackTag(post_index, tag_index){
    if(localStorage.getItem('token')){
      alert("블랙리스트에 추가되었습니다!");
      let black_tag = {'black_tag':this.posts[post_index].tag[tag_index]};
      this.uniService.addBlackTag(black_tag).subscribe(
        response =>{},
        error => console.log('error', error)
      );
    }else{
      alert("태그를 저장하는 기능입니다. 로그인 후에 사용가능합니다.")
    }
  }
  search_tag(tag){
    location.href='/timeline/'+tag;
  }

}
