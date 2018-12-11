import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavTagComponent } from './fav-tag.component';

describe('FavTagComponent', () => {
  let component: FavTagComponent;
  let fixture: ComponentFixture<FavTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
