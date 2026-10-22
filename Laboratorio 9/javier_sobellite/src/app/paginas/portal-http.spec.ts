
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { Registro } from './registro';
import { Estudiantes } from './estudiantes';
import { API_URL } from '../servicios/estudiantes-api';

describe('Portal HTTP: Registro', () => {
    let httpMock: HttpTestingController;
    let routeId: string | null;

    const estudiante = {
        id: '1',
        nombre: 'Elena Ruiz',
        programa: 'Software' as const,
        promedio: 16,
        asistencia: 90,
    };

    beforeEach(() => {
        routeId = null;

        TestBed.configureTestingModule({
            imports: [Registro],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([
                    { path: 'estudiantes', component: Registro },
                ]),
        {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: () => routeId,
                            },
                        },
                    },
                },
            ],
        });

        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    function crearFormulario() {
        const fixture = TestBed.createComponent(Registro);
        fixture.detectChanges();
        return fixture;
    }

    it('debe crear el formulario', () => {
        const fixture = crearFormulario();
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('debe mostrar el título de registro', () => {
        const fixture = crearFormulario();
        expect(fixture.nativeElement.querySelector('h1').textContent)
            .toContain('Registrar estudiante');
    });

    it('debe rechazar el formulario vacío sin enviar POST', () => {
        const fixture = crearFormulario();
        fixture.componentInstance.guardar();

        expect(fixture.componentInstance.error()).toBeTruthy();
        httpMock.expectNone(API_URL);
    });

    it('debe rechazar un promedio mayor que 20', () => {
        const fixture = crearFormulario();
        const formulario = fixture.componentInstance;

        formulario.nombre = 'Elena Ruiz';
        formulario.promedio = 21;
        formulario.asistencia = 90;
        formulario.guardar();

        expect(formulario.error()).toBeTruthy();
        httpMock.expectNone(API_URL);
    });

    it('debe rechazar una asistencia mayor que 100', () => {
        const fixture = crearFormulario();
        const formulario = fixture.componentInstance;

        formulario.nombre = 'Elena Ruiz';
        formulario.promedio = 16;
        formulario.asistencia = 101;
        formulario.guardar();

        expect(formulario.error()).toBeTruthy();
        httpMock.expectNone(API_URL);
    });

    it('debe crear un estudiante válido mediante POST', () => {
        const fixture = crearFormulario();
        const formulario = fixture.componentInstance;

        formulario.nombre = ' Elena Ruiz ';
        formulario.programa = 'Software';
        formulario.promedio = 16;
        formulario.asistencia = 90;
        formulario.guardar();

        const req = httpMock.expectOne(API_URL);
        expect(req.request.method).toBe('POST');
        expect(req.request.body.nombre).toBe('Elena Ruiz');

        req.flush(estudiante, {
            status: 201,
            statusText: 'Created',
        });
    });

    it('debe cargar los datos de un estudiante para editar', () => {
        routeId = '1';
        const fixture = crearFormulario();

        const req = httpMock.expectOne(`${API_URL}/1`);
        expect(req.request.method).toBe('GET');
        req.flush(estudiante);

        expect(fixture.componentInstance.nombre).toBe('Elena Ruiz');
        expect(fixture.componentInstance.promedio).toBe(16);
    });

    it('debe guardar los cambios mediante PATCH', () => {
        routeId = '1';
        const fixture = crearFormulario();

        const carga = httpMock.expectOne(`${API_URL}/1`);
        carga.flush(estudiante);

        fixture.componentInstance.promedio = 18;
        fixture.componentInstance.guardar();

        const req = httpMock.expectOne(`${API_URL}/1`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body.promedio).toBe(18);

        req.flush({ ...estudiante, promedio: 18 });
    });

    it('debe mostrar un error si el estudiante no existe', () => {
        routeId = '999';
        const fixture = crearFormulario();

        const req = httpMock.expectOne(`${API_URL}/999`);
        req.flush('No encontrado', {
            status: 404,
            statusText: 'Not Found',
        });

        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[role="alert"]'))
            .toBeTruthy();
    });
});

describe('Portal HTTP: filtros de estudiantes', () => {
    let httpMock: HttpTestingController;

    const estudiantes = [
        {
            id: '1',
            nombre: 'Elena Ruiz',
            programa: 'Software' as const,
            promedio: 16,
            asistencia: 90,
        },
        {
            id: '2',
            nombre: 'Carlos Pérez',
            programa: 'Sistemas' as const,
            promedio: 14,
            asistencia: 85,
        },
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [Estudiantes],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([]),
            ],
        });

        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    function cargarEstudiantes() {
        const fixture = TestBed.createComponent(Estudiantes);
        fixture.detectChanges();

        const req = httpMock.expectOne(API_URL);
        expect(req.request.method).toBe('GET');
        req.flush(estudiantes);

        fixture.detectChanges();
        return fixture;
    }

    it('debe mostrar un mensaje cuando no hay coincidencias', () => {
        const fixture = cargarEstudiantes();
        const componente = fixture.componentInstance;

        componente.filtroNombre.set('Nombre inexistente');
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent)
            .toContain('No se encontraron estudiantes con los filtros aplicados.');

        expect(
            fixture.nativeElement.querySelectorAll('app-tarjeta-estudiante').length
        ).toBe(0);
    });

    it('debe recuperar todas las tarjetas al limpiar los filtros', () => {
        const fixture = cargarEstudiantes();
        const componente = fixture.componentInstance;

        componente.filtroNombre.set('Nombre inexistente');
        fixture.detectChanges();

        expect(
            fixture.nativeElement.querySelectorAll('app-tarjeta-estudiante').length
        ).toBe(0);

        componente.limpiarFiltros();
        fixture.detectChanges();

        expect(
            fixture.nativeElement.querySelectorAll('app-tarjeta-estudiante').length
        ).toBe(2);
    });
});
