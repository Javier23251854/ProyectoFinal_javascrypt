import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import type {
  BorradorEstudiante,
  Programa,
} from '../modelos/estudiante';
import { EstudiantesApi } from '../servicios/estudiantes-api';
import { mensajeHttp } from '../servicios/mensaje-http';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Registro implements OnInit {
  private readonly api = inject(EstudiantesApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly programas: Programa[] = ['Software', 'Sistemas'];
  readonly id = signal<string | null>(null);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal('');
  readonly mensaje = signal('');

  nombre = '';
  programa: Programa = 'Software';
  promedio: number | null = null;
  asistencia: number | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.id.set(id);
      this.cargarEstudiante(id);
    }
  }

  private cargarEstudiante(id: string): void {
    this.cargando.set(true);
    this.error.set('');

    this.api
      .obtener(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.cargando.set(false)),
      )
      .subscribe({
        next: (estudiante) => {
          this.nombre = estudiante.nombre;
          this.programa = estudiante.programa;
          this.promedio = estudiante.promedio;
          this.asistencia = estudiante.asistencia;
        },
        error: (error) => this.error.set(mensajeHttp(error)),
      });
  }

  guardar(): void {
    this.error.set('');
    this.mensaje.set('');

    const nombre = this.nombre.trim();

    if (
      !nombre ||
      this.promedio === null ||
      this.asistencia === null ||
      !Number.isFinite(this.promedio) ||
      !Number.isFinite(this.asistencia) ||
      this.promedio < 0 ||
      this.promedio > 20 ||
      this.asistencia < 0 ||
      this.asistencia > 100
    ) {
      this.error.set(
        'Completa todos los campos con valores válidos. El promedio debe estar entre 0 y 20 y la asistencia entre 0 y 100.',
      );
      return;
    }

    const datos: BorradorEstudiante = {
      nombre,
      programa: this.programa,
      promedio: this.promedio,
      asistencia: this.asistencia,
    };

    this.guardando.set(true);

    const solicitud = this.id()
      ? this.api.actualizar(this.id()!, datos)
      : this.api.crear(datos);

    solicitud
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.guardando.set(false)),
      )
      .subscribe({
        next: () => {
          void this.router.navigate(['/estudiantes']);
        },
        error: (error) => this.error.set(mensajeHttp(error)),
      });
  }
}
