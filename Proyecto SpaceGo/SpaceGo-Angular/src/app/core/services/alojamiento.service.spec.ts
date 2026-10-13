import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AlojamientoService } from './alojamiento.service';

describe('AlojamientoService', () => {
  let service: AlojamientoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(AlojamientoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return fallback alojamientos when the backend is unavailable', () => {
    let result: any[] = [];

    service.obtenerAlojamientos().subscribe((alojamientos) => {
      result = alojamientos;
    });

    const req = httpMock.expectOne('http://localhost:3000/alojamientos');
    req.flush(null, {
      status: 500,
      statusText: 'Server Error'
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].titulo).toContain('Habitación');
  });
});
