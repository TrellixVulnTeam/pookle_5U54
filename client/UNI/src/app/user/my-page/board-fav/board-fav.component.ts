import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UniService } from '../../../uni.Service';

@Component({
  selector: 'board-fav',
  templateUrl: './board-fav.component.html',
  styleUrls: ['./board-fav.component.css']
})
export class BoardFavComponent implements OnInit {
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
    let id = {$oid: this.data_[i]._id};
    this.uniService.unFavBoard(id).subscribe(
      response => {
        this.refresh.emit('');
      },
      error => console.log('error', error)
    );
  }

}
