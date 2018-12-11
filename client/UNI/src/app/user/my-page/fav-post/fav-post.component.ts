import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fav-post',
  templateUrl: './fav-post.component.html',
  styleUrls: ['./fav-post.component.css']
})
export class FavPostComponent implements OnInit {
  @Input() data;

  constructor() { }

  ngOnInit() {
  }

}
