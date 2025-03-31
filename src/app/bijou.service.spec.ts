import { TestBed } from '@angular/core/testing';

import { BijouService } from './bijou.service';

describe('BijouServiceService', () => {
  let service: BijouService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BijouService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
