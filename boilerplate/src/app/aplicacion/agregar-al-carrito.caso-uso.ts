// APLICACIÓN · Recupera el producto dentro del negocio del carrito.
import { Carrito } from '../dominio/modelos/carrito.modelo';
import { RepositorioProductos } from '../dominio/contratos/repositorio-productos.contrato';

export interface AgregarAlCarritoComando {
  carritoActual: Carrito;
  productoId: string;
  cantidad: number;
}

export class AgregarAlCarritoCasoUso {
  constructor(private readonly repositorioProductos: RepositorioProductos) {}

  async ejecutar(comando: AgregarAlCarritoComando): Promise<Carrito> {
    const producto = await this.repositorioProductos.buscarPorId(comando.carritoActual.negocioId, comando.productoId);
    if (!producto) throw new Error('Producto no encontrado en este negocio');
    return comando.carritoActual.agregar(producto, comando.cantidad);
  }
}
