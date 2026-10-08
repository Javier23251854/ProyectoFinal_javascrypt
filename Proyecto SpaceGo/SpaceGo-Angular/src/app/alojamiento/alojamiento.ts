import { Component } from '@angular/core';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe, TitleCasePipe],
  selector: 'app-alojamiento',
  styleUrl: './alojamiento.css',
  templateUrl: './alojamiento.html',
})
export class Alojamiento {

  imagenes = [
    '/Imagenes/persona sola.jpg',
    '/Imagenes/alojamiento.jpg',
    '/Imagenes/cuarto pareja.jpg'
  ];

  indiceImagen = 0;

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