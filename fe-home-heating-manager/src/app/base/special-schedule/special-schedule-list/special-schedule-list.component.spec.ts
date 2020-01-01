import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialScheduleListComponent } from './special-schedule-list.component';

describe('SpecialScheduleListComponent', () => {
  let component: SpecialScheduleListComponent;
  let fixture: ComponentFixture<SpecialScheduleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialScheduleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialScheduleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
