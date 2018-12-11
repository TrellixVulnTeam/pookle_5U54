import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavPostComponent } from './fav-post.component';

describe('FavPostComponent', () => {
  let component: FavPostComponent;
  let fixture: ComponentFixture<FavPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
