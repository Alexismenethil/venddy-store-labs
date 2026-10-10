// INFRAESTRUCTURA · Publicación ilustrativa de un evento para cocina.
// La API futura distribuye el evento por WebSocket; no hay servicio conectado.
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { NotificadorPedido } from '../dominio/contratos/notificador-pedido.contrato';
import { Pedido } from '../dominio/modelos/pedido.modelo';

export class NotificadorTiempoReal implements NotificadorPedido {
  constructor(private readonly http: HttpClient, private readonly urlBase: string | null = null) {}

  async confirmarPedido(pedido: Pedido): Promise<void> {
    if (!this.urlBase) throw new Error('Servicio de avisos a cocina sin configurar');
    await firstValueFrom(this.http.post(
      `${this.urlBase.replace(/\/$/, '')}/negocios/${encodeURIComponent(pedido.negocioId)}/eventos/pedido-recibido`,
      { pedidoId: pedido.id, mesa: pedido.mesa, totalCentimos: pedido.totalCentimos },
      { headers: { 'Idempotency-Key': pedido.id } }));
  }
}
