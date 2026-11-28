
import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  type HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import type {
  Estudiante,
  BorradorEstudiante,
} from '../../modelos/estudiante';

@Injectable({
  providedIn: 'root',
})
export class EstudiantesApi {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://127.0.0.1:3000/estudiantes';

  listar(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.url).pipe(
      catchError(this.manejarError),
    );
  }

  obtener(id: string): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.url}/${id}`).pipe(
      catchError(this.manejarError),
    );
  }

  crear(estudiante: BorradorEstudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.url, estudiante).pipe(
      catchError(this.manejarError),
    );
  }

  actualizar(
    id: string,
    estudiante: BorradorEstudiante,
  ): Observable<Estudiante> {
    return this.http.put<Estudiante>(
      `${this.url}/${id}`,
      { id, ...estudiante },
    ).pipe(catchError(this.manejarError));
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      catchError(this.manejarError),
    );
  }

  private manejarError(error: HttpErrorResponse) {
    console.error('Error al comunicarse con la API:', error);
    return throwError(() => error);
  }
}
