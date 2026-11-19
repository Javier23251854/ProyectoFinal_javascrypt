
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type TipoSolicitud = 'contacto' | 'alquiler';

export interface Solicitud {
  id: string;
  usuarioId: string;
  alojamientoId: string | number;
  tipo: TipoSolicitud;
  mensaje: string;
  fecha: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private readonly http = inject(HttpClient);

  crearSolicitud(datos: {
    alojamientoId: string | number;
    tipo: TipoSolicitud;
    mensaje: string;
  }): Observable<Solicitud> {
    return this.http.post<Solicitud>('/api/solicitudes', datos);
  }
}
