/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CuentaService } from './cuenta.service';

describe('Service: Cuenta', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CuentaService]
    });
  });

  it('should ...', inject([CuentaService], (service: CuentaService) => {
    expect(service).toBeTruthy();
  }));
});
