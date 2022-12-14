import { Component, OnInit } from '@angular/core';
import { UniService } from '../uni.Service';
import { FormBuilder,Validators } from '@angular/forms';
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
  short_post:boolean;
  search_word;
  postData;
  maxPost=20;
  user;
  search_cnt=0;
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
    this.getAdminPost();
    this.getList();
    
  }

  @HostListener('window:scroll', ['$event']) onScrollEvent($event){
    let pageHeight=document.documentElement.offsetHeight
    let windowHeight=window.innerHeight
    if(window.pageYOffset+windowHeight>=pageHeight-300){
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
      return Math.floor(elapsed_time)+"?????? ???";
    }else if(elapsed_time>=86400){
      elapsed_time /= 86400;
      return Math.floor(elapsed_time)+"??? ???";
    }else if(elapsed_time>=3600){
      elapsed_time /= 3600;
      return Math.floor(elapsed_time)+"?????? ???";
    }else if(elapsed_time>=300){
      elapsed_time /=60;
      return Math.floor(elapsed_time)+"??? ???";
    }else{
      return "?????? ???";
    }
  }
  favorite(ind : number){

    if(localStorage.getItem('token')){
      let postData = {
        id:this.posts[ind]._id.$oid,
        title:this.posts[ind].title,
        url:this.posts[ind].url,
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
      alert("?????? ????????? ????????? ?????? ?????????????????????.")
    }
    
    
  }
  write(content){
    this.writeForm.reset();
    this.advertiseForm.reset();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    });
  }
  send(){
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
      let postData={
        id:this.posts[ind]._id.$oid,
        title:this.posts[ind].title
      }
      this.uniService.removePost(postData).subscribe(
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
        if(response){
          this.advertise_post = JSON.parse(response);
          console.log(this.advertise_post);
          this.getList();
        }
      },
      error => console.log('error',error)
    );
  }


  getAdminPost(){
    this.uniService.getAdminPost().subscribe(
      response => {
        if(response){
          this.admin_post = JSON.parse(response);
          this.admin_post.isFull = true;
          this.admin_post.date = this.timeConverter(this.admin_post.date);
          if(this.admin_post.post.length<50){
            this.short_post = true;
          }else{
            this.short_post = false;
          }
          if(this.admin_post.post.length>50 && !this.isFull){
            if(this.isCategory){
              this.admin_post.post= this.admin_post.post.slice(0,35);
            }else{
              this.admin_post.post= this.admin_post.post.slice(0,50);
            }
            this.admin_post.isFull = false;
          }
        }
      },
      error => console.log('?????? ????????? !!error', error)
    );
  }
  fullPost(){
    this.isFull =!this.isFull;
    this.getAdminPost();
  }

  getList(option:number=0){
    window.scrollTo(0, 0);
    this.posts='';
    let real_href = window.location.href.split('/');
    let last_href = real_href[real_href.length-1];
    if(last_href=='timeline' || option >=1){
      this.router.navigate(['/timeline']);
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
        error => console.log('?????? ????????? !!error', error)

      );
    }
    this.uniService.getTimelineList(option).subscribe(
      response => {
        this.posts = JSON.parse(response);
        let len = this.posts.length;
        this.isFavorite= [];
        for(let i=0;i<len;i++){
          if(this.posts[i].fin_date)
            this.posts[i].adv=true;
          if(this.posts[i].post == "0" && this.posts[i].post != ""){
            this.posts[i].post = "[System]?????? ????????? ????????? ?????? ?????????????????????.";
          }else if(this.posts[i].post == 1 || this.posts[i].post == ""){
            this.posts[i].post = "[System]????????? ????????? ??????????????????!"
          }
          this.posts[i].after_date = this.timeConverter(this.posts[i].date);
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
            error => console.log('?????? ????????? !!error', error)
      
          );
        }
    this.postData={
      word:this.search_word
    }
    this.uniService.search(this.postData).subscribe(
      response => {
        this.posts = JSON.parse(response);
        let len = this.posts.length;
        this.search_cnt = this.posts.length;
        this.isFavorite= [];
        for(let i=0;i<len;i++){
          if(this.posts[i].post == "0" && this.posts[i].post != ""){
            this.posts[i].post = "[System]?????? ????????? ????????? ?????? ?????????????????????.";
          }else if(this.posts[i].post == 1 || this.posts[i].post == ""){
            this.posts[i].post = "[System]????????? ????????? ??????????????????!"
          }
          this.posts[i].after_date = this.timeConverter(this.posts[i].date);
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
  addView(i){
    let postData = {
      id: this.posts[i]._id.$oid,
      title: this.posts[i].title
    }
    this.uniService.addView(postData).subscribe(
      response =>{
        console.log(this.posts[i].view);
      },
      error => console.log('error', error)
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
      alert("??????????????? ?????????????????????!");
      let fav_tag = {'fav_tag':this.posts[post_index].tag[tag_index]};
      this.uniService.addFavTag(fav_tag).subscribe(
        response =>{},
        error => console.log('error', error)
      );
    }else{
      alert("????????? ???????????? ???????????????. ????????? ?????? ?????????????????????.")
    }
  }
  addBlackTag(post_index, tag_index){
    if(localStorage.getItem('token')){
      alert("?????????????????? ?????????????????????!");
      let black_tag = {'black_tag':this.posts[post_index].tag[tag_index]};
      this.uniService.addBlackTag(black_tag).subscribe(
        response =>{},
        error => console.log('error', error)
      );
    }else{
      alert("????????? ???????????? ???????????????. ????????? ?????? ?????????????????????.")
    }
  }
  search_tag(tag){
    location.href='/#/timeline/'+tag;
  }

}
