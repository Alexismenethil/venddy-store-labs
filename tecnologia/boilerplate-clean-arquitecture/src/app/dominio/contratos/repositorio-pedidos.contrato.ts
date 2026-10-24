// DOMINIO · El adaptador garantiza una sola unidad de escritura.
import { Carrito } from '../modelos/carrito.modelo';
import { Pedido } from '../modelos/pedido.modelo';

export interface RegistroPedido {
  negocioId: string;
  clienteId: string;
  mesa: number;
  carrito: Carrito;
  claveIdempotencia: string;
}

export interface RepositorioPedidos {
  // Relee precios y stock del negocio, valida todas las líneas, reserva stock
  // y guarda el pedido juntos. Un rechazo no modifica nada. Repetir una clave
  // con los mismos datos devuelve el pedido anterior sin consumir más stock.
  registrarAtomico(registro: RegistroPedido): Promise<Pedido>;
  buscarPorId(negocioId: string, id: string): Promise<Pedido | null>;
  listarPorCliente(negocioId: string, clienteId: string): Promise<Pedido[]>;
}
