import { TestBed } from '@angular/core/testing';

import { PDFcontratoFinalService } from './pdfcontrato-final.service';

describe('PDFcontratoFinalService', () => {
  let service: PDFcontratoFinalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PDFcontratoFinalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
