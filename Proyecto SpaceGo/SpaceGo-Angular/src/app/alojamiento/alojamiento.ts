
import { UsuarioService } from '../core/services/usuario.service';
import { SolicitudService, type TipoSolicitud } from '../core/services/solicitud.service';

import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, Location } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject
} from '@angular/core';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { combineLatest, of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  tap
} from 'rxjs/operators';

import { AlojamientoService } from '../core/services/alojamiento.service';
import { Alojamiento as AlojamientoModel } from '../models/alojamiento';

type DetalleAlojamiento = AlojamientoModel;

@Component({
  selector: 'app-alojamiento',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, FormsModule],
  styleUrl: './alojamiento.css',
  templateUrl: './alojamiento.html'
})
export class Alojamiento implements OnInit {
  protected auth = inject(UsuarioService);

  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly alojamientoService = inject(AlojamientoService);
  private readonly solicitudService = inject(SolicitudService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  alojamiento: DetalleAlojamiento | null = null;

  cargando = true;
  error = '';

  imagenes: string[] = [];
  indiceImagen = 0;

  mapaUrl: SafeResourceUrl | null = null;
  mapaTieneCoordenadas = false;

  agregandoFavorito = false;
  favoritoGuardado = false;
  errorFavorito = '';

  volverUrl = '/buscar';

  // Estado del formulario de solicitudes.
  mostrarFormularioSolicitud = false;
  tipoSolicitud: TipoSolicitud = 'contacto';
  mensajeSolicitud = '';
  enviandoSolicitud = false;
  errorSolicitud = '';
  estadoSolicitud = '';

  get textoVolver(): string {
    return this.volverUrl.startsWith('/favoritos')
      ? 'Volver a favoritos'
      : this.volverUrl === '/'
        ? 'Volver al inicio'
        : 'Volver a resultados';
  }

  readonly nombresTipo: Record<string, string> = {
    individual: 'Habitación individual',
    pareja: 'Espacio para pareja',
    minidepa: 'Minidepartamento',
    departamento: 'Departamento'
  };

  volver(): void {
    if (history.state?.spacegoOrigen === this.volverUrl) {
      this.location.back();
    } else {
      void this.router.navigateByUrl(this.volverUrl);
    }
  }

  imagenFallida(event: Event): void {
    const imagen = event.target as HTMLImageElement;

    if (!imagen.src.endsWith('/Imagenes/alojamiento.jpg')) {
      imagen.src = '/Imagenes/alojamiento.jpg';
    }
  }

  ngOnInit(): void {
    combineLatest([
      this.route.paramMap,
      this.route.queryParamMap
    ]).pipe(
      map(([params, query]) => {
        const regreso = query.get('volver') ?? '/buscar';

        this.volverUrl =
          /^\/(buscar|favoritos)(\?.*)?$/.test(regreso) || regreso === '/'
            ? regreso
            : '/buscar';

        const id = params.get('id') ?? query.get('id');

        if (!id) {
          void this.router.navigate(['/buscar'], { replaceUrl: true });
        }

        return id;
      }),

      distinctUntilChanged(),

      tap(() => {
        this.favoritoGuardado = false;
        this.errorFavorito = '';
        this.cargando = true;
        this.error = '';
        this.alojamiento = null;
        this.imagenes = [];
        this.indiceImagen = 0;
        this.mapaUrl = null;

        this.mostrarFormularioSolicitud = false;
        this.errorSolicitud = '';
        this.estadoSolicitud = '';
        this.mensajeSolicitud = '';

        this.cdr.markForCheck();
      }),

      switchMap(id => id
        ? this.alojamientoService.obtenerAlojamientoPorId(id).pipe(
            map(datos =>
              datos && String(datos.id) === id
                ? datos as DetalleAlojamiento
                : null
            ),
            catchError(err => {
              console.error('Error al cargar el alojamiento:', err);
              return of(null);
            })
          )
        : of(null)
      ),

      takeUntilDestroyed(this.destroyRef)
    ).subscribe(datos => {
      this.cargando = false;

      if (!datos) {
        this.error = 'No encontramos el alojamiento solicitado o no está disponible.';
        this.cdr.markForCheck();
        return;
      }

      this.alojamiento = datos;

      const candidatas = [
        ...(Array.isArray(datos.imagenes) ? datos.imagenes : []),
        datos.imagen
      ];

      this.imagenes = [
        ...new Set(
          candidatas.filter((imagen): imagen is string =>
            typeof imagen === 'string' && imagen.trim().length > 0
          )
        )
      ];

      this.prepararMapa(datos);
      this.cdr.markForCheck();
    });
  }

  obtenerNombreTipo(tipo: string): string {
    return this.nombresTipo[tipo] ?? tipo;
  }

  get serviciosIncluidos(): string[] {
    if (!this.alojamiento) return [];

    const datos = this.alojamiento;

    return Array.isArray(datos.incluye)
      ? datos.incluye
      : Array.isArray(datos.caracteristicas)
        ? datos.caracteristicas
        : [];
  }

  get serviciosNoIncluidos(): string[] {
    const lista = this.alojamiento?.noIncluye;
    return Array.isArray(lista) ? lista : [];
  }

  private prepararMapa(datos: DetalleAlojamiento): void {
    const lat = datos.latitud == null || datos.latitud === ''
      ? NaN
      : Number(datos.latitud);

    const lon = datos.longitud == null || datos.longitud === ''
      ? NaN
      : Number(datos.longitud);

    const coordenadasValidas =
      Number.isFinite(lat) &&
      Number.isFinite(lon) &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180 &&
      !(lat === 0 && lon === 0);

    this.mapaTieneCoordenadas = coordenadasValidas;

    const consulta = coordenadasValidas
      ? `${lat},${lon}`
      : `${datos.distrito}, ${datos.provincia}, ${datos.departamento}, Perú`;

    const url =
      `https://www.google.com/maps?q=${encodeURIComponent(consulta)}&output=embed`;

    this.mapaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  agregarAFavoritos(): void {
    if (!this.alojamiento || this.agregandoFavorito || this.favoritoGuardado) {
      return;
    }

    this.errorFavorito = '';
    this.agregandoFavorito = true;
    this.cdr.markForCheck();

    this.alojamientoService.agregarFavorito(this.alojamiento.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.agregandoFavorito = false;
          this.favoritoGuardado = true;
          this.cdr.markForCheck();
        },
        error: error => {
          this.agregandoFavorito = false;
          console.error('Error al agregar favorito:', error);

          this.errorFavorito =
            'No se pudo guardar. Comprueba que el servicio esté disponible e inténtalo otra vez.';

          this.cdr.markForCheck();
        }
      });
  }

  abrirFormularioSolicitud(): void {
    this.errorSolicitud = '';
    this.estadoSolicitud = '';

    // Se comprueba la sesión en el servidor antes de permitir continuar.
    this.auth.comprobarSesion()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: usuario => {
          if (!usuario) {
            void this.router.navigate(['/login'], {
              queryParams: { volver: this.router.url }
            });
            return;
          }

          this.mostrarFormularioSolicitud = true;
          this.cdr.markForCheck();
        },
        error: error => {
          console.error('Error al comprobar sesión:', error);

          this.errorSolicitud =
            'No se pudo comprobar tu sesión. Inténtalo nuevamente.';

          this.cdr.markForCheck();
        }
      });
  }

  cerrarFormularioSolicitud(): void {
    if (this.enviandoSolicitud) return;

    this.mostrarFormularioSolicitud = false;
    this.errorSolicitud = '';
    this.mensajeSolicitud = '';
    this.cdr.markForCheck();
  }

  enviarSolicitud(): void {
    if (!this.alojamiento || this.enviandoSolicitud) return;

    const mensaje = this.mensajeSolicitud.trim();

    if (mensaje.length < 10 || mensaje.length > 1000) {
      this.errorSolicitud =
        'El mensaje debe tener entre 10 y 1000 caracteres.';
      return;
    }

    this.errorSolicitud = '';
    this.estadoSolicitud = '';
    this.enviandoSolicitud = true;
    this.cdr.markForCheck();

    this.solicitudService.crearSolicitud({
      alojamientoId: this.alojamiento.id,
      tipo: this.tipoSolicitud,
      mensaje
    }).pipe(
      finalize(() => {
        this.enviandoSolicitud = false;
        this.cdr.markForCheck();
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.mostrarFormularioSolicitud = false;
        this.mensajeSolicitud = '';
        this.estadoSolicitud =
          '¡Tu solicitud fue enviada! Puedes consultar su estado en Mis Solicitudes.';

        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          void this.router.navigate(['/login'], {
            queryParams: { volver: this.router.url }
          });
          return;
        }

        this.errorSolicitud =
          error.error?.mensaje ??
          'No se pudo enviar la solicitud. Inténtalo nuevamente.';

        this.cdr.markForCheck();
      }
    });
  }

  imagenSiguiente(): void {
    if (this.imagenes.length < 2) return;

    this.indiceImagen =
      (this.indiceImagen + 1) % this.imagenes.length;
  }

  imagenAnterior(): void {
    if (this.imagenes.length < 2) return;

    this.indiceImagen =
      (this.indiceImagen - 1 + this.imagenes.length) %
      this.imagenes.length;
  }
}
