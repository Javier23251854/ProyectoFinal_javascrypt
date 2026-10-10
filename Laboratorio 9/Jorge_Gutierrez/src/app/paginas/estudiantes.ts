import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { TarjetaEstudiante } from '../componentes/tarjeta-estudiante';
import type { Estudiante } from '../modelos/estudiante';
import { EstudiantesApi } from '../servicios/estudiantes-api';
import { mensajeHttp } from '../servicios/mensaje-http';

@Component({
  standalone: true,
  imports: [RouterLink, TarjetaEstudiante],
  templateUrl: './estudiantes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Estudiantes implements OnInit {
  private readonly api = inject(EstudiantesApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly lista = signal<Estudiante[]>([]);
  readonly filtroNombre = signal('');
  readonly filtroPrograma = signal('');

  readonly listaFiltrada = computed(() => {
    const nombre = this.filtroNombre().trim().toLocaleLowerCase('es-PE');
    const programa = this.filtroPrograma();

    return this.lista().filter((estudiante) => {
      const coincideNombre = estudiante.nombre
        .toLocaleLowerCase('es-PE')
        .includes(nombre);

      const coincidePrograma =
        !programa || estudiante.programa === programa;

      return coincideNombre && coincidePrograma;
    });
  });

  limpiarFiltros(): void {
    this.filtroNombre.set('');
    this.filtroPrograma.set('');
  }
  readonly seleccionado = signal<Estudiante | null>(null);
  readonly pendiente = signal<Estudiante | null>(null);
  readonly cargando = signal(false);
  readonly eliminando = signal(false);
  readonly errorCarga = signal('');
  readonly errorAccion = signal('');
  readonly mensaje = signal('');

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    if (this.cargando() || this.eliminando()) return;

    this.cargando.set(true);
    this.errorCarga.set('');

    this.api
      .listar()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.cargando.set(false)),
      )
      .subscribe({
        next: (datos) => {
          this.lista.set(datos);
          this.seleccionado.set(null);
        },
        error: (error) => this.errorCarga.set(mensajeHttp(error)),
      });
  }

  seleccionar(estudiante: Estudiante): void {
    this.seleccionado.set(estudiante);
  }

  probarEliminar(): void {
    window.alert('El botón Eliminar funciona');
  }

  confirmarEliminacion(): void {
    const estudiante = this.pendiente();

    if (!estudiante || this.eliminando() || this.cargando()) return;

    this.eliminando.set(true);
    this.errorAccion.set('');
    this.mensaje.set('');

    this.api
      .eliminar(estudiante.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.eliminando.set(false)),
      )
      .subscribe({
        next: () => {
          this.lista.update((lista) =>
            lista.filter((item) => item.id !== estudiante.id),
          );
          this.pendiente.set(null);
          this.mensaje.set(`Se eliminó a ${estudiante.nombre}.`);
        },
        error: (error) => this.errorAccion.set(mensajeHttp(error)),
      });
  }
}