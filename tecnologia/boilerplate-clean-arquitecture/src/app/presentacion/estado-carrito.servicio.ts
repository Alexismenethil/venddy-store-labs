// PRESENTACIÓN · Estado compartido de la carta QR y el carrito.
import { Injectable, computed, signal } from '@angular/core';
import { Carrito } from '../dominio/modelos/carrito.modelo';
import { formatearSoles } from '../dominio/modelos/precios';

@Injectable({ providedIn: 'root' })
export class EstadoCarrito {
  private readonly contextoQr = new URLSearchParams(window.location.search);
  readonly negocioId = this.contextoQr.get('negocio') || 'NEG-001';
  readonly mesa = Number(this.contextoQr.get('mesa') || '1');
  readonly negocioNombre = this.negocioId === 'NEG-001' ? 'Restaurante Killa'
    : this.negocioId === 'NEG-002' ? 'Cafetería Inti' : this.negocioId;
  private readonly carritoInterno = signal<Carrito>(Carrito.vacio(this.negocioId));
  readonly carrito = this.carritoInterno.asReadonly();
  readonly cantidadDeItems = computed(() => this.carritoInterno().cantidadDeItems);
  readonly total = computed(() => formatearSoles(this.carritoInterno().calcularTotal()));
  readonly estaVacio = computed(() => this.carritoInterno().estaVacio());

  actualizar(carrito: Carrito): void {
    if (carrito.negocioId !== this.negocioId) throw new Error('El carrito pertenece a otro negocio');
    this.carritoInterno.set(carrito);
  }

  vaciar(): void { this.carritoInterno.set(Carrito.vacio(this.negocioId)); }
}
