import { CurrencyPipe } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { AlojamientoService } from '../core/services/alojamiento.service';
import { Alojamiento as AlojamientoModel } from '../models/alojamiento';

// Campos adicionales opcionales: el db.json actual no incluye todos estos datos.
// Solo se muestran cuando el anuncio realmente los proporciona.
type DetalleAlojamiento = AlojamientoModel & {
  imagenes?: string[];
  latitud?: number | string | null;
  longitud?: number | string | null;
  capacidad?: string;
  incluye?: string[];
  noIncluye?: string[];
  caracteristicas?: string[];
  contacto?: { telefono?: string; correo?: string };
};

@Component({
  selector: 'app-alojamiento',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  styleUrl: './alojamiento.css',
  templateUrl: './alojamiento.html'
})
export class Alojamiento implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly alojamientoService = inject(AlojamientoService);
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
  menuAbierto = false;

  readonly nombresTipo: Record<string, string> = {
    individual: 'Habitación individual',
    pareja: 'Espacio para pareja',
    minidepa: 'Minidepartamento',
    departamento: 'Departamento'
  };

  ngOnInit(): void {
    // Acepta tanto /alojamiento/7 como /alojamiento?id=7 (ruta usada por Favoritos).
    // La suscripción también actualiza el detalle si cambia el ID sin recrear el componente.
    combineLatest([this.route.paramMap, this.route.queryParamMap]).pipe(
      map(([params, query]) => params.get('id') ?? query.get('id') ?? '1'),
      distinctUntilChanged(),
      tap(() => {
        this.cargando = true;
        this.error = '';
        this.alojamiento = null;
        this.imagenes = [];
        this.indiceImagen = 0;
        this.mapaUrl = null;
        // Marca el componente para actualizar la vista, también en modo zoneless.
        this.cdr.markForCheck();
      }),
      switchMap(id => this.alojamientoService.obtenerAlojamientoPorId(id).pipe(
        // La implementación actual del servicio puede devolver el alojamiento 1
        // cuando el ID solicitado no existe. No se debe mostrar ese dato equivocado.
        map(datos => datos && String(datos.id) === id ? datos as DetalleAlojamiento : null),
        catchError(err => {
          console.error('Error al cargar el alojamiento:', err);
          return of(null);
        })
      )),
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
      this.imagenes = [...new Set(candidatas.filter((imagen): imagen is string =>
        typeof imagen === 'string' && imagen.trim().length > 0
      ))];
      this.prepararMapa(datos);
      // Suscripciones HTTP: Angular no detecta cambios en variables normales
      // automáticamente en una app zoneless.
      this.cdr.markForCheck();
    });
  }

  obtenerNombreTipo(tipo: string): string {
    return this.nombresTipo[tipo] ?? tipo;
  }

  get serviciosIncluidos(): string[] {
    if (!this.alojamiento) return [];
    const datos = this.alojamiento;
    return Array.isArray(datos.incluye) ? datos.incluye :
      Array.isArray(datos.caracteristicas) ? datos.caracteristicas : [];
  }

  get serviciosNoIncluidos(): string[] {
    const lista = this.alojamiento?.noIncluye;
    return Array.isArray(lista) ? lista : [];
  }

  private prepararMapa(datos: DetalleAlojamiento): void {
    const lat = datos.latitud == null || datos.latitud === '' ? NaN : Number(datos.latitud);
    const lon = datos.longitud == null || datos.longitud === '' ? NaN : Number(datos.longitud);
    const coordenadasValidas = Number.isFinite(lat) && Number.isFinite(lon) &&
      lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180 && !(lat === 0 && lon === 0);
    this.mapaTieneCoordenadas = coordenadasValidas;

    // Solo se usa una URL fija de Google Maps, con la ubicación codificada.
    // El catálogo actual solo almacena distritos; en ese caso el mapa es aproximado.
    const consulta = coordenadasValidas ? `${lat},${lon}` :
      `${datos.distrito}, ${datos.provincia}, ${datos.departamento}, Perú`;
    const url = `https://www.google.com/maps?q=${encodeURIComponent(consulta)}&output=embed`;
    this.mapaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  agregarAFavoritos(): void {
    if (!this.alojamiento || this.agregandoFavorito) return;
    const id = Number(this.alojamiento.id);
    if (!Number.isFinite(id)) return;

    this.agregandoFavorito = true;
    this.cdr.markForCheck();
    this.alojamientoService.agregarFavorito(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.agregandoFavorito = false;
          this.cdr.markForCheck();
          void this.router.navigate(['/favoritos']);
        },
        error: error => {
          this.agregandoFavorito = false;
          this.cdr.markForCheck();
          console.error('Error al agregar favorito:', error);
          alert('No se pudo guardar el alojamiento como favorito.');
        }
      });
  }

  imagenSiguiente(): void {
    if (this.imagenes.length < 2) return;
    this.indiceImagen = (this.indiceImagen + 1) % this.imagenes.length;
  }

  imagenAnterior(): void {
    if (this.imagenes.length < 2) return;
    this.indiceImagen = (this.indiceImagen - 1 + this.imagenes.length) % this.imagenes.length;
  }
}
