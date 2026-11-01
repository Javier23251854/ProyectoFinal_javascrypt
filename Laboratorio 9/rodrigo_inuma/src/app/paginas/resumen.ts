import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { estadoAcademico } from '../modelos/estudiante';
import type { Estudiante } from '../modelos/estudiante';
import { EstudiantesApi } from '../servicios/estudiantes-api';
import { mensajeHttp } from '../servicios/mensaje-http';

@Component({
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './resumen.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Resumen implements OnInit {
  private readonly api = inject(EstudiantesApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly estudiantes = signal<Estudiante[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');

  readonly total = () => this.estudiantes().length;

  readonly promedioGeneral = () => {
    const datos = this.estudiantes();
    if (!datos.length) return 0;
    return datos.reduce((suma, e) => suma + e.promedio, 0) / datos.length;
  };

  readonly destacados = () =>
    this.estudiantes().filter((e) => estadoAcademico(e.promedio) === 'Destacado').length;

  readonly enRiesgo = () =>
    this.estudiantes().filter((e) => estadoAcademico(e.promedio) === 'En riesgo').length;

  ngOnInit(): void {
    this.cargando.set(true);
    this.api
      .listar()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.cargando.set(false)),
      )
      .subscribe({
        next: (datos) => this.estudiantes.set(datos),
        error: (error) => this.error.set(mensajeHttp(error)),
      });
  }
}