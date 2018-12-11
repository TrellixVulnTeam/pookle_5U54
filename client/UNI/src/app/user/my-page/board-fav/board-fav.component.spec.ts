import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardFavComponent } from './board-fav.component';

describe('BoardFavComponent', () => {
  let component: BoardFavComponent;
  let fixture: ComponentFixture<BoardFavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardFavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardFavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
