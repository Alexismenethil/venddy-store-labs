// DOMINIO · Avisar de un pedido ya registrado; nunca decide si el pedido existe.
import { Pedido } from '../modelos/pedido.modelo';

export interface NotificadorPedido {
  // La entrega debe ser idempotente por negocio + pedido.
  confirmarPedido(pedido: Pedido): Promise<void>;
}
