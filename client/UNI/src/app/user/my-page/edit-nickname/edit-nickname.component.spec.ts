import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNicknameComponent } from './edit-nickname.component';

describe('EditNicknameComponent', () => {
  let component: EditNicknameComponent;
  let fixture: ComponentFixture<EditNicknameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNicknameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNicknameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
