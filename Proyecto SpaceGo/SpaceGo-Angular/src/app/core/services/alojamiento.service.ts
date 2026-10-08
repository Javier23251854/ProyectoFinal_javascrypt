import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alojamiento } from '../../models/alojamiento';

@Injectable({
  providedIn: 'root'
})
export class AlojamientoService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/alojamientos';

  obtenerAlojamientos(): Observable<Alojamiento[]> {
    return this.http.get<Alojamiento[]>(this.apiUrl);
  }

  obtenerFavoritos(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/favoritos');
  }
  eliminarFavorito(id: number): Observable<void> {
    return this.http.delete<void>(
      `http://localhost:3000/favoritos/${id}`
    );
  }

  obtenerAlojamientoPorId(id: string): Observable<Alojamiento> {
    return this.http.get<Alojamiento>(`${this.apiUrl}/${id}`);
  }

  crearAlojamiento(
    alojamiento: Omit<Alojamiento, 'id'>
  ): Observable<Alojamiento> {
    return this.http.post<Alojamiento>(
      this.apiUrl,
      alojamiento
    );
  }
  actualizarAlojamiento(
    id: string,
    alojamiento: Partial<Alojamiento>
  ): Observable<Alojamiento> {
    return this.http.patch<Alojamiento>(
      `${this.apiUrl}/${id}`,
      alojamiento
    );
  }

  eliminarAlojamiento(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}