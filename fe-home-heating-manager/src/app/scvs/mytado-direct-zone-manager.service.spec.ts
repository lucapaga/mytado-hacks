import { TestBed } from '@angular/core/testing';

import { MytadoDirectZoneManagerService } from './mytado-direct-zone-manager.service';

describe('MytadoDirectZoneManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MytadoDirectZoneManagerService = TestBed.get(MytadoDirectZoneManagerService);
    expect(service).toBeTruthy();
  });
});
