import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialScheduleDetailsComponent } from './special-schedule-details.component';

describe('SpecialScheduleDetailsComponent', () => {
  let component: SpecialScheduleDetailsComponent;
  let fixture: ComponentFixture<SpecialScheduleDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialScheduleDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialScheduleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
