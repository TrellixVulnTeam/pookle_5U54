import { Component, OnInit, ChangeDetectionStrategy,  Input  } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'find-account',
  templateUrl: './find-account.component.html',
  styleUrls: ['./find-account.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slide', [state('left', style({ transform: 'translateX(0)' })),
    state('center', style({ transform: 'translateX(-25%)' })),
    state('right', style({ transform: 'translateX(-50%)' })),
    state('finish', style({ transform: 'translateX(-75%)' })),
      transition('* => *', animate(300))
  ])]
})
export class FindAccountComponent implements OnInit {
  first:boolean=true;
  @Input() activePane: PaneType = 'left';

  constructor() { }

  ngOnInit() {
    console.log(this.activePane);
  }
  move(){
    this.first = false;
  }
}
type PaneType = 'left' |'right' | 'center'|'finish';
