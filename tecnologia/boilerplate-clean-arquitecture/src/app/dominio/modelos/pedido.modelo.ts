// DOMINIO · Pedido para cocina. Registrar un pedido no significa cobrarlo.
import { importeEnCentimos } from './precios';

export type EstadoPedido = 'recibido' | 'en_preparacion' | 'listo' | 'entregado' | 'cancelado';
export interface LineaPedido {
  readonly productoId: string;
  readonly nombre: string;
  readonly precioUnitarioCentimos: number;
  readonly cantidad: number;
}

export class Pedido {
  private constructor(
    public readonly id: string,
    public readonly negocioId: string,
    public readonly clienteId: string,
    public readonly mesa: number,
    public readonly lineas: ReadonlyArray<LineaPedido>,
    public readonly totalCentimos: number,
    public readonly claveIdempotencia: string,
    public readonly estadoActual: EstadoPedido,
  ) { Object.freeze(this); }

  static crear(id: string, negocioId: string, clienteId: string, mesa: number,
    lineas: ReadonlyArray<LineaPedido>, claveIdempotencia: string): Pedido {
    if (!id.trim() || !negocioId.trim() || !clienteId.trim()) throw new Error('El pedido necesita identificador, negocio y comensal');
    if (!Number.isSafeInteger(mesa) || mesa <= 0) throw new Error('La mesa debe ser un entero mayor que cero');
    if (!claveIdempotencia.trim()) throw new Error('Se requiere una clave de idempotencia');
    if (lineas.length === 0) throw new Error('Un pedido no puede estar vacío');
    if (new Set(lineas.map((linea) => linea.productoId)).size !== lineas.length) throw new Error('El pedido no admite productos duplicados');
    const copia = Object.freeze(lineas.map((linea) => {
      if (!linea.productoId.trim() || !linea.nombre.trim()) throw new Error('Una línea debe identificar al producto');
      importeEnCentimos(linea.precioUnitarioCentimos, linea.cantidad);
      return Object.freeze({ ...linea });
    }));
    const total = copia.reduce((suma, linea) => suma + importeEnCentimos(linea.precioUnitarioCentimos, linea.cantidad), 0);
    if (!Number.isSafeInteger(total)) throw new Error('El total excede el límite de céntimos');
    return new Pedido(id, negocioId, clienteId, mesa, copia, total, claveIdempotencia, 'recibido');
  }

  iniciarPreparacion(): Pedido { return this.cambiarEstado('recibido', 'en_preparacion'); }
  marcarListo(): Pedido { return this.cambiarEstado('en_preparacion', 'listo'); }
  entregar(): Pedido { return this.cambiarEstado('listo', 'entregado'); }
  cancelar(): Pedido { return this.cambiarEstado('recibido', 'cancelado'); }

  private cambiarEstado(desde: EstadoPedido, hacia: EstadoPedido): Pedido {
    if (this.estadoActual !== desde) throw new Error(`Un pedido ${this.estadoActual} no puede pasar a ${hacia}`);
    return new Pedido(this.id, this.negocioId, this.clienteId, this.mesa, this.lineas,
      this.totalCentimos, this.claveIdempotencia, hacia);
  }
}
