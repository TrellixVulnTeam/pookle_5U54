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
    let id = {$oid: this.data[i]._id};
    console.log(id);
    this.uniService.unFavTimeline(id).subscribe(
      response => {
        this.data.splice(i,1);
      },
      error => console.log('error', error)
    );
  }
}
