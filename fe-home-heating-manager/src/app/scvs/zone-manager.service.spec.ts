import { TestBed } from '@angular/core/testing';

import { ZoneManagerService } from './zone-manager.service';

describe('ZoneManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ZoneManagerService = TestBed.get(ZoneManagerService);
    expect(service).toBeTruthy();
  });
});
