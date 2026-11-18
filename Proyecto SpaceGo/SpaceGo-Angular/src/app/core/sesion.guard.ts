 import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { UsuarioService } from './services/usuario.service';

const rutasPrivadas = new Set([
  '/favoritos', '/publicar', '/mi-perfil', '/administrar-publicaciones',
  '/centro-ayuda', '/comparar-alojamientos', '/mis-solicitudes',
]);

export function esRutaPrivada(url: string): boolean {
  return rutasPrivadas.has(url.split(/[?#]/)[0].replace(/\/$/, ''));
}

export const requiereSesion: CanActivateFn = (_ruta, estado) => {
  const router = inject(Router);
  const login = router.createUrlTree(['/login'], { queryParams: { volver: estado.url } });
  return inject(UsuarioService).comprobarSesion().pipe(
    map(usuario => usuario ? true : login),
    catchError(() => of(login)),
  );
};
