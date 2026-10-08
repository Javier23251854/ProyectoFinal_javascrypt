import { Component, inject, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AlojamientoService } from '../core/services/alojamiento.service';
import { Alojamiento } from '../models/alojamiento';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css'
})
export class Favoritos implements OnInit {

  private alojamientoService = inject(AlojamientoService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  alojamientos: Alojamiento[] = [];
  favoritos: Alojamiento[] = [];
  resultados: Alojamiento[] = [];

  formulario = this.fb.group({
    tipo: ['todos'],
    precioMaximo: [''],
    ordenar: ['recientes']
  });

  ngOnInit(): void {
    this.cargarFavoritos();
  }

  cargarFavoritos(): void {
    this.alojamientoService.obtenerAlojamientos().subscribe({
      next: (datos) => {
        this.alojamientos = datos;

        this.alojamientoService.obtenerFavoritos().subscribe({
          next: (favoritosIds) => {

            this.favoritos = datos.filter(alojamiento =>
              favoritosIds.some(
                favorito => favorito.alojamientoId === Number(alojamiento.id)
              )
            );

            this.aplicarFiltros();
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Error al cargar favoritos:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar alojamientos:', error);
      }
    });
  }
  aplicarFiltros(): void {
    const filtros = this.formulario.value;

    const tipo = filtros.tipo || 'todos';
    const precioMaximo =
      Number(filtros.precioMaximo) || Infinity;

    this.resultados = this.favoritos.filter(alojamiento => {

      const coincideTipo =
        tipo === 'todos' ||
        alojamiento.tipo === tipo;

      const coincidePrecio =
        alojamiento.precio <= precioMaximo;

      return coincideTipo && coincidePrecio;
    });

    this.ordenarResultados();
  }

  ordenarResultados(): void {
    const criterio = this.formulario.value.ordenar;

    this.resultados = [...this.resultados];

    if (criterio === 'precio-asc') {
      this.resultados.sort(
        (a, b) => a.precio - b.precio
      );
    }

    if (criterio === 'precio-desc') {
      this.resultados.sort(
        (a, b) => b.precio - a.precio
      );
    }

    if (criterio === 'recientes') {
      this.resultados.sort(
        (a, b) =>
          new Date(b.fecha).getTime() -
          new Date(a.fecha).getTime()
      );
    }
  }

  quitarDeFavoritos(id: string): void {
    this.alojamientoService.obtenerFavoritos().subscribe({
      next: (favoritos) => {

        const favorito = favoritos.find(
          item => item.alojamientoId === Number(id)
        );

        if (!favorito) {
          return;
        }

        this.alojamientoService
          .eliminarFavorito(favorito.id)
          .subscribe({
            next: () => {
              this.cargarFavoritos();
            },
            error: (error) => {
              console.error('Error al quitar favorito:', error);
            }
          });
      },
      error: (error) => {
        console.error('Error al obtener favoritos:', error);
      }
    });
  }

  limpiarFiltros(): void {
    this.formulario.reset({
      tipo: 'todos',
      precioMaximo: '',
      ordenar: 'recientes'
    });

    this.aplicarFiltros();
  }
}