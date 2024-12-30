import { TestBed } from '@angular/core/testing';

import { ServiceIpService } from './service-ip.service';

describe('ServiceIpService', () => {
  let service: ServiceIpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceIpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
