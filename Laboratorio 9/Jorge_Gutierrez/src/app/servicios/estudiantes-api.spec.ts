
import { TestBed } from '@angular/core/testing';
import {
  HttpErrorResponse,
  provideHttpClient,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { API_URL, EstudiantesApi } from './estudiantes-api';
import type {
  BorradorEstudiante,
  Estudiante,
} from '../modelos/estudiante';

describe('EstudiantesApi', () => {
  let api: EstudiantesApi;
  let httpMock: HttpTestingController;

  const borrador: BorradorEstudiante = {
    nombre: 'Elena Ruiz',
    programa: 'Software',
    promedio: 16,
    asistencia: 90,
  };

  const estudiante: Estudiante = {
    id: '1',
    ...borrador,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    api = TestBed.inject(EstudiantesApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe listar los estudiantes mediante GET', () => {
    api.listar().subscribe((datos) => {
      expect(datos).toEqual([estudiante]);
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush([estudiante]);
  });

  it('debe obtener un estudiante por su ID', () => {
    api.obtener('1').subscribe((dato) => {
      expect(dato).toEqual(estudiante);
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(estudiante);
  });

  it('debe crear un estudiante mediante POST', () => {
    api.crear(borrador).subscribe((dato) => {
      expect(dato).toEqual(estudiante);
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(borrador);
    req.flush(estudiante, { status: 201, statusText: 'Created' });
  });

  it('debe actualizar parcialmente mediante PATCH', () => {
    const cambios = { promedio: 18 };

    api.actualizar('1', cambios).subscribe((dato) => {
      expect(dato.promedio).toBe(18);
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(cambios);
    req.flush({ ...estudiante, ...cambios });
  });

  it('debe reemplazar un estudiante mediante PUT', () => {
    api.reemplazar('1', borrador).subscribe((dato) => {
      expect(dato.nombre).toBe('Elena Ruiz');
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(borrador);
    req.flush(estudiante);
  });

  it('debe eliminar un estudiante mediante DELETE', () => {
    api.eliminar('1').subscribe();

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('debe codificar el ID en la URL', () => {
    api.obtener('id especial').subscribe();

    const req = httpMock.expectOne(
      `${API_URL}/id%20especial`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(estudiante);
  });

  it('debe propagar los errores HTTP', () => {
    let errorRecibido: HttpErrorResponse | undefined;

    api.listar().subscribe({
      error: (error: HttpErrorResponse) => {
        errorRecibido = error;
      },
    });

    const req = httpMock.expectOne(API_URL);
    req.flush('Error del servidor', {
      status: 500,
      statusText: 'Server Error',
    });

    expect(errorRecibido).toBeInstanceOf(HttpErrorResponse);
    expect(errorRecibido?.status).toBe(500);
  });
});
