import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UniService } from '../../../uni.Service';

@Component({
  selector: 'fav-tag',
  templateUrl: './fav-tag.component.html',
  styleUrls: ['./fav-tag.component.css']
})
export class FavTagComponent implements OnInit {
  @Input() data;
  @Output() refresh:EventEmitter<any> = new EventEmitter();

  constructor(private uniService: UniService) { }

  ngOnInit() {
  }

  removeTag(index){
    let remove_tag = {'fav_tag':this.data[index]};
    this.uniService.removeFavTag(remove_tag).subscribe(
      response => {
        this.refresh.emit('');
      },
      error => console.log('이건 에러야 !!error', error)
    );
  }
}
