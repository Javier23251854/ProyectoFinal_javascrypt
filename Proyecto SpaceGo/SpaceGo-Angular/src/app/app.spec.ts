import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { UsuarioService } from './core/services/usuario.service';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
      imports: [App],
    }).compileComponents();
  });

  it('renderiza la navegación de visitante sin enlaces privados', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('/api/auth/sesion').flush({ usuario: null });
    fixture.detectChanges();

    const pagina = fixture.nativeElement as HTMLElement;
    const enlaces = [...pagina.querySelectorAll('nav a')].map(enlace => enlace.textContent?.trim());
    expect(enlaces).toEqual(['Inicio', 'Buscar alojamiento', 'Iniciar sesión']);
    expect(pagina.querySelector('router-outlet')).not.toBeNull();
    http.verify();
  });

  it('muestra las opciones privadas y vuelve al menú público al cerrar sesión', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('/api/auth/sesion').flush({
      usuario: { id: 'usuario-1', name: 'Prueba de sesión', email: 'prueba@example.test' },
    });
    fixture.detectChanges();

    const pagina = fixture.nativeElement as HTMLElement;
    const opciones = () => [...pagina.querySelectorAll('nav a')].map(enlace => enlace.textContent?.trim());
    expect(opciones()).toEqual(['Inicio', 'Buscar alojamiento', 'Publicar alojamiento', 'Favoritos', 'Mi perfil']);
    pagina.querySelector<HTMLButtonElement>('nav button')?.click();
    const salida = http.expectOne('/api/auth/salir');
    expect(salida.request.method).toBe('POST');
    salida.flush(null, { status: 204, statusText: 'No Content' });
    fixture.detectChanges();
    expect(opciones()).toEqual(['Inicio', 'Buscar alojamiento', 'Iniciar sesión']);
    http.verify();
  });

  it('envía al visitante al login cuando abre una ruta privada', async () => {
    TestBed.overrideProvider(UsuarioService, { useValue: { comprobarSesion: () => of(null) } });
    const harness = await RouterTestingHarness.create('/publicar');

    expect(harness.routeNativeElement?.querySelector('#login-email')).not.toBeNull();
    expect(harness.fixture.nativeElement.textContent).toContain('Ingresa tus credenciales');
  });
});
