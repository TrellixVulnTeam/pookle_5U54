import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UniService } from '../../../uni.Service';

@Component({
  selector: 'fav-tag',
  templateUrl: './fav-tag.component.html',
  styleUrls: ['./fav-tag.component.css']
})
export class FavTagComponent implements OnInit {
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

  removeTag(index){
    let remove_tag = {'fav_tag':this.data_[index]};
    this.uniService.removeFavTag(remove_tag).subscribe(
      response => {
        this.refresh.emit('');
      },
      error => console.log('이건 에러야 !!error', error)
    );
  }
}
