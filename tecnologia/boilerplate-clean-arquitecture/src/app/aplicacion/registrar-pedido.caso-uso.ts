// APLICACIÓN · Registro del comensal: validar → guardar/reservar → avisar.
// El cobro de caja es otra responsabilidad y no participa de este caso de uso.
import { Pedido } from '../dominio/modelos/pedido.modelo';
import { RegistroPedido, RepositorioPedidos } from '../dominio/contratos/repositorio-pedidos.contrato';
import { NotificadorPedido } from '../dominio/contratos/notificador-pedido.contrato';

export type RegistrarPedidoComando = RegistroPedido;
export interface ResultadoRegistrarPedido {
  pedido: Pedido;
  avisoPendiente: boolean;
}

export class RegistrarPedidoCasoUso {
  constructor(private readonly repositorioPedidos: RepositorioPedidos,
    private readonly notificadorPedido: NotificadorPedido) {}

  async ejecutar(comando: RegistrarPedidoComando): Promise<ResultadoRegistrarPedido> {
    if (comando.negocioId !== comando.carrito.negocioId) throw new Error('El carrito pertenece a otro negocio');
    if (comando.carrito.estaVacio()) throw new Error('No se puede registrar un carrito vacío');
    const pedido = await this.repositorioPedidos.registrarAtomico(comando);
    try {
      await this.notificadorPedido.confirmarPedido(pedido);
      return { pedido, avisoPendiente: false };
    } catch {
      // Un aviso fallido no convierte un pedido guardado en un registro fallido.
      // La misma clave permite reintentar el aviso sin duplicar ni reservar otra vez.
      return { pedido, avisoPendiente: true };
    }
  }
}
