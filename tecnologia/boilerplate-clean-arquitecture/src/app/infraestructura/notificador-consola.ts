// INFRAESTRUCTURA · Aviso local idempotente de un pedido registrado.
import { NotificadorPedido } from '../dominio/contratos/notificador-pedido.contrato';
import { Pedido } from '../dominio/modelos/pedido.modelo';
import { formatearSoles } from '../dominio/modelos/precios';

export class NotificadorConsola implements NotificadorPedido {
  private readonly avisados = new Set<string>();

  async confirmarPedido(pedido: Pedido): Promise<void> {
    const clave = JSON.stringify([pedido.negocioId, pedido.id]);
    if (this.avisados.has(clave)) return;
    console.log(`[Cocina ${pedido.negocioId}] Pedido ${pedido.id}, mesa ${pedido.mesa}, S/ ${formatearSoles(pedido.totalCentimos)}. Cobro pendiente en caja.`);
    this.avisados.add(clave);
  }
}
