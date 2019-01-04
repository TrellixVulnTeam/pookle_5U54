import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UniService } from '../../../uni.Service';

@Component({
  selector: 'timeline-fav',
  templateUrl: './timeline-fav.component.html',
  styleUrls: ['./timeline-fav.component.css']
})
export class TimelineFavComponent implements OnInit {
  data_;
  is_empty=true;
  @Input() 
  set data(value) {
    if(value && value.length>=1){
      this.data_ = value;
      this.is_empty = false;
    }else{
      this.data_ = [];
      this.is_empty = true;
    }
  }
  @Output() refresh:EventEmitter<any> = new EventEmitter();

  constructor(private uniService: UniService) { }

  ngOnInit() {
    
  }
  unFav(i:number){
    let postData = {
      id:this.data_[i]._id,
      title:this.data_[i].title,
      url:this.data_[i].url,
      date:this.data_[i].date
    }
    this.uniService.unFavTimeline(postData).subscribe(
      response => {
        this.refresh.emit('');
      },
      error => console.log('error', error)
    );
  }
}