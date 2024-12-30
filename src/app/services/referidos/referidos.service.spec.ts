import { TestBed } from '@angular/core/testing';

import { ReferidosService } from './referidos.service';

describe('ReferidosService', () => {
  let service: ReferidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
