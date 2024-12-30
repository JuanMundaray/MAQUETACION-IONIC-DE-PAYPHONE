import { TestBed } from '@angular/core/testing';

import { NubariumService } from './nubarium.service';

describe('NubariumService', () => {
  let service: NubariumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NubariumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
