import { TestBed } from '@angular/core/testing';

import { MytadoDirectLoginService } from './mytado-direct-login.service';

describe('MytadoDirectLoginService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MytadoDirectLoginService = TestBed.get(MytadoDirectLoginService);
    expect(service).toBeTruthy();
  });
});
