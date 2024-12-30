import { TestBed } from '@angular/core/testing';

import { SigntureService } from './signture.service';

describe('SigntureService', () => {
  let service: SigntureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SigntureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
