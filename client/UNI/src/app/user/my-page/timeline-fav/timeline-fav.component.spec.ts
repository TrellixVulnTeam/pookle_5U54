import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineFavComponent } from './timeline-fav.component';

describe('TimelineFavComponent', () => {
  let component: TimelineFavComponent;
  let fixture: ComponentFixture<TimelineFavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineFavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineFavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
