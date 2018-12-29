import { Component, OnInit, Input } from '@angular/core';
import { UniService } from '../../../uni.Service';

@Component({
  selector: 'board-fav',
  templateUrl: './board-fav.component.html',
  styleUrls: ['./board-fav.component.css']
})
export class BoardFavComponent implements OnInit {
  @Input() data;

  constructor(private uniService: UniService) { }

  ngOnInit() {
  }
  unFav(i:number){
    let id = {$oid: this.data[i]._id};
    this.uniService.unFavBoard(id).subscribe(
      response => {
        this.data.splice(i,1);
      },
      error => console.log('error', error)
    );
  }

}
