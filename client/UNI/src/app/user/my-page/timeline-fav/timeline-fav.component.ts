import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UniService } from '../../../uni.Service';

@Component({
  selector: 'timeline-fav',
  templateUrl: './timeline-fav.component.html',
  styleUrls: ['./timeline-fav.component.css']
})
export class TimelineFavComponent implements OnInit {
  @Input() data;
  @Output() refresh:EventEmitter<any> = new EventEmitter();

  constructor(private uniService: UniService) { }

  ngOnInit() {
    
  }
  unFav(i:number){
    let postData = {
      id:this.data[i]._id.$oid,
      title:this.data[i].title,
      date:this.data[i].date
    }
    let id = {$oid: this.data[i]._id};
    this.uniService.unFavTimeline(postData).subscribe(
      response => {
        this.data.splice(i,1);
      },
      error => console.log('error', error)
    );
  }
}