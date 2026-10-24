// PRESENTACIÓN · Confirmar pedido para cocina; el pago se registra luego en caja.
import { Component, inject, signal } from '@angular/core';
import { Pedido } from '../../dominio/modelos/pedido.modelo';
import { LineaCarrito } from '../../dominio/modelos/carrito.modelo';
import { formatearSoles } from '../../dominio/modelos/precios';
import { RegistrarPedidoCasoUso } from '../../aplicacion/registrar-pedido.caso-uso';
import { EstadoCarrito } from '../estado-carrito.servicio';

@Component({
  selector: 'app-carrito', standalone: true,
  template: `
    <section>
      <h2>Tu pedido · Mesa {{ estadoCarrito.mesa }}</h2>
      @if (estadoCarrito.estaVacio()) { <p>El carrito está vacío. Agrega productos desde la carta.</p> }
      @else {
        <div class="tabla">
          <table>
            <thead><tr><th>Producto</th><th>Cantidad</th><th>Unitario</th><th>Importe</th><th></th></tr></thead>
            <tbody>
              @for (linea of estadoCarrito.carrito().items; track linea.producto.id) {
                <tr>
                  <td>{{ linea.producto.nombre }}</td><td>{{ linea.cantidad }}</td>
                  <td>S/ {{ soles(linea.producto.precioCentimos) }}</td><td>S/ {{ importe(linea) }}</td>
                  <td><button class="quitar" (click)="quitar(linea.producto.id)" [disabled]="procesando()">Quitar</button></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="total">Total de carta: <strong>S/ {{ estadoCarrito.total() }}</strong></p>
        <p>Los precios se verifican al confirmar. El cobro se realiza por separado en caja.</p>
        <button (click)="confirmarPedido()" [disabled]="procesando()">
          {{ procesando() ? 'Registrando...' : 'Confirmar pedido' }}
        </button>
      }
      @if (mensajeError()) { <p role="alert" class="error">{{ mensajeError() }}</p> }
      @if (pedidoConfirmado(); as pedido) {
        <div role="status" class="confirmacion">
          <h3>Pedido registrado para cocina</h3>
          <p><strong>{{ pedido.id }}</strong> · Mesa {{ pedido.mesa }}</p>
          <p>Total confirmado: <strong>S/ {{ soles(pedido.totalCentimos) }}</strong></p>
          <p>Estado: {{ pedido.estadoActual }} · Cobro pendiente en caja.</p>
          @if (avisoPendiente()) { <p>El pedido está guardado. El aviso a cocina quedó pendiente de reintento.</p> }
        </div>
      }
    </section>
  `,
  styles: [`
    .tabla { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    th, td { border-bottom: 1px solid #d6dfda; padding: 10px; font-size: 14px; text-align: left; }
    th { background: #eef3ef; }
    .total { text-align: right; font-size: 20px; color: #215c50; }
    button { padding: 10px 18px; border: 0; border-radius: 5px; background: #215c50; color: #fff; cursor: pointer; }
    .quitar { background: #eef3ef; color: #215c50; padding: 6px; }
    button:disabled { opacity: .6; cursor: wait; }
    .error { color: #a42b22; }
    .confirmacion { margin-top: 20px; padding: 18px; border: 1px solid #8bada0; border-radius: 8px; background: #eef6f0; }
  `],
})
export class CarritoComponent {
  private readonly registrarPedido = inject(RegistrarPedidoCasoUso);
  private claveIdempotencia = crypto.randomUUID();
  readonly estadoCarrito = inject(EstadoCarrito);
  readonly mensajeError = signal('');
  readonly procesando = signal(false);
  readonly pedidoConfirmado = signal<Pedido | null>(null);
  readonly avisoPendiente = signal(false);
  soles = formatearSoles;

  importe(linea: LineaCarrito): string { return formatearSoles(this.estadoCarrito.carrito().importeLinea(linea)); }
  quitar(productoId: string): void { this.estadoCarrito.actualizar(this.estadoCarrito.carrito().quitar(productoId)); }

  async confirmarPedido(): Promise<void> {
    if (this.procesando()) return;
    this.mensajeError.set(''); this.procesando.set(true);
    try {
      const resultado = await this.registrarPedido.ejecutar({
        negocioId: this.estadoCarrito.negocioId, clienteId: 'COMENSAL-DEMO', mesa: this.estadoCarrito.mesa,
        carrito: this.estadoCarrito.carrito(), claveIdempotencia: this.claveIdempotencia,
      });
      this.pedidoConfirmado.set(resultado.pedido);
      this.avisoPendiente.set(resultado.avisoPendiente);
      this.estadoCarrito.vaciar();
      this.claveIdempotencia = crypto.randomUUID();
    } catch (error) { this.mensajeError.set((error as Error).message); }
    finally { this.procesando.set(false); }
  }
}
