import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AlojamientoService } from '../core/services/alojamiento.service';
import { Alojamiento as AlojamientoModel } from '../models/alojamiento';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-alojamiento',
  styleUrl: './alojamiento.css',
  templateUrl: './alojamiento.html',
})
export class Alojamiento implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private alojamientoService = inject(AlojamientoService);

  alojamiento: AlojamientoModel | null = null;

  imagenes = [
    '/Imagenes/persona sola.jpg',
    '/Imagenes/alojamiento.jpg',
    '/Imagenes/cuarto pareja.jpg'
  ];

  indiceImagen = 0;

  ngOnInit(): void {
    const id =
      this.route.snapshot.paramMap.get('id') ??
      this.route.snapshot.queryParamMap.get('id') ??
      '1';

    this.alojamientoService.obtenerAlojamientoPorId(id).subscribe({
      next: (datos) => {
        this.alojamiento = datos;
        if (datos?.imagen) {
          this.imagenes = [datos.imagen, '/Imagenes/alojamiento.jpg', '/Imagenes/cuarto pareja.jpg'];
        }
      },
      error: (error) => {
        console.error('Error al cargar alojamiento:', error);
      }
    });
  }

  agregarAFavoritos(): void {
    if (!this.alojamiento) {
      return;
    }

    this.alojamientoService.agregarFavorito(Number(this.alojamiento.id)).subscribe({
      next: () => {
        this.router.navigate(['/favoritos']);
      },
      error: (error) => {
        console.error('Error al agregar favorito:', error);
        alert('No se pudo guardar el alojamiento como favorito.');
      }
    });
  }

  imagenSiguiente(): void {
    this.indiceImagen =
      (this.indiceImagen + 1) % this.imagenes.length;
  }

  imagenAnterior(): void {
    this.indiceImagen =
      (this.indiceImagen - 1 + this.imagenes.length) %
      this.imagenes.length;
  }

}