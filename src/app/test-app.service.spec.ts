import { TestBed, inject } from '@angular/core/testing';

import { TestAppService } from './test-app.service';

describe('TestAppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestAppService]
    });
  });

  it('should be created', inject([TestAppService], (service: TestAppService) => {
    expect(service).toBeTruthy();
  }));
});
