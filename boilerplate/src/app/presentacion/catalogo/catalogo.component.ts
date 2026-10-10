// PRESENTACIÓN · Recoge acciones y muestra datos; el dominio valida las reglas.
import { Component, inject, signal, OnInit } from '@angular/core';
import { Producto } from '../../dominio/modelos/producto.modelo';
import { formatearSoles } from '../../dominio/modelos/precios';
import { ConsultarCatalogoCasoUso } from '../../aplicacion/consultar-catalogo.caso-uso';
import { AgregarAlCarritoCasoUso } from '../../aplicacion/agregar-al-carrito.caso-uso';
import { EstadoCarrito } from '../estado-carrito.servicio';

@Component({
  selector: 'app-catalogo', standalone: true,
  template: `
    <section>
      <header class="barra">
        <h2>Carta del negocio</h2>
        <label>Categoría
          <select (change)="filtrar($any($event.target).value)">
            <option value="">Todas</option><option value="plato">Platos</option>
            <option value="bebida">Bebidas</option><option value="postre">Postres</option>
          </select>
        </label>
      </header>
      @if (mensajeError()) { <p role="alert" class="error">{{ mensajeError() }}</p> }
      <div class="rejilla">
        @for (producto of productos(); track producto.id) {
          <article class="tarjeta">
            <p class="meta">{{ producto.categoria }}</p>
            <h3>{{ producto.nombre }}</h3>
            <p class="precio">S/ {{ precio(producto) }}</p>
            <p class="stock">{{ producto.stockDisponible }} disponibles</p>
            <button (click)="agregar(producto)" [disabled]="agregando()">Agregar al carrito</button>
          </article>
        } @empty { <p>No hay productos disponibles para esta categoría.</p> }
      </div>
      @if (mensaje()) { <p role="status">{{ mensaje() }}</p> }
    </section>
  `,
  styles: [`
    .barra { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 12px; }
    .rejilla { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .tarjeta { border: 1px solid #d6dfda; border-radius: 8px; padding: 18px; background: #fff; }
    .tarjeta h3 { font-size: 17px; min-height: 40px; margin: 0 0 12px; }
    .meta { color: #6a7771; font-size: 12px; text-transform: uppercase; }
    .precio { font-size: 22px; font-weight: bold; color: #215c50; margin-bottom: 4px; }
    .stock { font-size: 13px; color: #66736f; }
    select { padding: 7px; border: 1px solid #ccd6d0; border-radius: 5px; margin-left: 6px; }
    button { width: 100%; padding: 10px; border: 0; border-radius: 5px; background: #215c50; color: #fff; cursor: pointer; }
    button:disabled { opacity: .6; cursor: wait; }
    .error { color: #a42b22; }
  `],
})
export class CatalogoComponent implements OnInit {
  private readonly consultarCatalogo = inject(ConsultarCatalogoCasoUso);
  private readonly agregarAlCarrito = inject(AgregarAlCarritoCasoUso);
  private readonly estadoCarrito = inject(EstadoCarrito);
  readonly productos = signal<Producto[]>([]);
  readonly mensajeError = signal('');
  readonly mensaje = signal('');
  readonly agregando = signal(false);

  async ngOnInit(): Promise<void> { await this.filtrar(''); }
  precio(producto: Producto): string { return formatearSoles(producto.precioCentimos); }

  async filtrar(categoria: string): Promise<void> {
    this.mensajeError.set('');
    try {
      this.productos.set(await this.consultarCatalogo.ejecutar(this.estadoCarrito.negocioId, categoria ? { categoria } : undefined));
    } catch (error) { this.mensajeError.set((error as Error).message); }
  }

  async agregar(producto: Producto): Promise<void> {
    if (this.agregando()) return;
    this.mensajeError.set(''); this.mensaje.set(''); this.agregando.set(true);
    try {
      const carrito = await this.agregarAlCarrito.ejecutar({
        carritoActual: this.estadoCarrito.carrito(), productoId: producto.id, cantidad: 1,
      });
      this.estadoCarrito.actualizar(carrito);
      this.mensaje.set(`${producto.nombre} agregado al carrito.`);
    } catch (error) { this.mensajeError.set((error as Error).message); }
    finally { this.agregando.set(false); }
  }
}
