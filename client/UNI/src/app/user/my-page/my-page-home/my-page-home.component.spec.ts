import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPageHomeComponent } from './my-page-home.component';

describe('MyPageHomeComponent', () => {
  let component: MyPageHomeComponent;
  let fixture: ComponentFixture<MyPageHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPageHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPageHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
