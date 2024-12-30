import { TestBed } from '@angular/core/testing';

import { PDFautorizacionBuroService } from './pdfautorizacion-buro.service';

describe('PDFautorizacionBuroService', () => {
  let service: PDFautorizacionBuroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PDFautorizacionBuroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
