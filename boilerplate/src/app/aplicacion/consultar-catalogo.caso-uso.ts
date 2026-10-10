// APLICACIÓN · Solo importa dominio; la carta muestra productos disponibles.
import { Producto } from '../dominio/modelos/producto.modelo';
import { RepositorioProductos, FiltroCatalogo } from '../dominio/contratos/repositorio-productos.contrato';

export class ConsultarCatalogoCasoUso {
  constructor(private readonly repositorioProductos: RepositorioProductos) {}

  async ejecutar(negocioId: string, filtro?: FiltroCatalogo): Promise<Producto[]> {
    if (!negocioId.trim()) throw new Error('Se requiere un negocio para consultar la carta');
    const productos = await this.repositorioProductos.listar(negocioId, filtro);
    return productos.filter((producto) => producto.negocioId === negocioId && producto.estaDisponible());
  }
}
