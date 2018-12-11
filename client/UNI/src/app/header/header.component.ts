import { Component, OnInit, HostListener } from '@angular/core';
import { UniService } from '../uni.Service'
import { SlideInOutAnimation } from '../animation';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'all-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [SlideInOutAnimation]  
})
export class HeaderComponent implements OnInit {
  is_auth:boolean=false;
  animationState = 'in';
  searchForm = this.fb.group({
    word:['']
  });
  constructor(private uniService: UniService,
    private fb: FormBuilder, 
    private router: Router,) {

   }

  ngOnInit() {
    if(localStorage.getItem('token')){
      this.is_auth=true;
    }else{
      this.is_auth=false;
    }

  }
  @HostListener('window:scroll', ['$event']) onScrollEvent($event){
    if(window.pageYOffset>=110){
      this.animationState='out';
    }else{
      this.animationState='in';
    }
  }
  
  search(){
    let word = this.searchForm.value;
    location.href='/timeline/'+this.searchForm.value.word;
    //this.router.navigate(['/timeline/'+this.searchForm.value.word]);
  }

}
