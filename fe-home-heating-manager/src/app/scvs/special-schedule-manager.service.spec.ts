import { TestBed } from '@angular/core/testing';

import { SpecialScheduleManagerService } from './special-schedule-manager.service';

describe('SpecialScheduleManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpecialScheduleManagerService = TestBed.get(SpecialScheduleManagerService);
    expect(service).toBeTruthy();
  });
});
