// INFRAESTRUCTURA · Unidad atómica local de pedido + reserva de inventario.
import { Pedido } from '../dominio/modelos/pedido.modelo';
import { RepositorioPedidos, RegistroPedido } from '../dominio/contratos/repositorio-pedidos.contrato';
import { RepositorioProductosMemoria } from './repositorio-productos-memoria';

export class RepositorioPedidosMemoria implements RepositorioPedidos {
  private readonly pedidos = new Map<string, Pedido>();
  private readonly registros = new Map<string, { huella: string; pedido: Pedido }>();
  private secuencia = 0;

  constructor(private readonly productos: RepositorioProductosMemoria) {}

  async registrarAtomico(registro: RegistroPedido): Promise<Pedido> {
    if (registro.negocioId !== registro.carrito.negocioId) throw new Error('El carrito pertenece a otro negocio');
    if (!registro.claveIdempotencia.trim()) throw new Error('Se requiere una clave de idempotencia');
    const clave = JSON.stringify([registro.negocioId, registro.claveIdempotencia]);
    const solicitudes = registro.carrito.items.map((linea) => ({ productoId: linea.producto.id, cantidad: linea.cantidad }));
    // Se comparan los datos del intento; los precios del carrito no son autoridad.
    const huella = JSON.stringify([registro.clienteId, registro.mesa,
      [...solicitudes].sort((a, b) => a.productoId.localeCompare(b.productoId))]);
    const anterior = this.registros.get(clave);
    if (anterior) {
      if (anterior.huella !== huella) throw new Error('La clave de idempotencia ya fue usada con otros datos');
      return anterior.pedido;
    }
    const id = `PED-${String(this.secuencia + 1).padStart(6, '0')}`;
    // Este método no suspende su ejecución: validación, stock e índices se
    // actualizan antes de que otro registro pueda ejecutarse en este proceso.
    const pedido = this.productos.reservarParaPedido(registro.negocioId, solicitudes, (lineas) =>
      Pedido.crear(id, registro.negocioId, registro.clienteId, registro.mesa, lineas, registro.claveIdempotencia));
    this.secuencia++;
    this.pedidos.set(JSON.stringify([pedido.negocioId, pedido.id]), pedido);
    this.registros.set(clave, { huella, pedido });
    return pedido;
  }

  async buscarPorId(negocioId: string, id: string): Promise<Pedido | null> {
    return this.pedidos.get(JSON.stringify([negocioId, id])) ?? null;
  }

  async listarPorCliente(negocioId: string, clienteId: string): Promise<Pedido[]> {
    return [...this.pedidos.values()].filter((pedido) => pedido.negocioId === negocioId && pedido.clienteId === clienteId);
  }
}
