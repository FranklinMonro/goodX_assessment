import { TestBed } from '@angular/core/testing';

import { FormsErrorsService } from './form-errors.service';

describe('FormErrorsService', () => {
  let service: FormsErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormsErrorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
