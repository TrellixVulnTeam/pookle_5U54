import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UniService } from '../../../uni.Service';

@Component({
  selector: 'blacklist',
  templateUrl: './blacklist.component.html',
  styleUrls: ['./blacklist.component.css']
})
export class BlacklistComponent implements OnInit {

  @Input() data;
  @Output() refresh:EventEmitter<any> = new EventEmitter();

  constructor(private uniService: UniService) { }

  ngOnInit() {
  }

  removeTag(index){
    let remove_tag = {'black_tag':this.data[index]};
    this.uniService.removeBlackTag(remove_tag).subscribe(
      response => {
        this.refresh.emit('');
      },
      error => console.log('이건 에러야 !!error', error)
    );
  }

}
