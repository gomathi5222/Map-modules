import { TestBed } from '@angular/core/testing';

import { EsriServiceService } from './esri--service.service';

describe('EsriServiceService', () => {
  let service: EsriServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EsriServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
