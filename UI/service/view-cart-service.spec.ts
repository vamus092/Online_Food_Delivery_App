import { TestBed } from '@angular/core/testing';

import { ViewCartService } from './view-cart-service';

describe('ViewCartService', () => {
  let service: ViewCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
