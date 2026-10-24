// INFRAESTRUCTURA · Inventario local; todas las claves incluyen al negocio.
import { Producto } from '../dominio/modelos/producto.modelo';
import { LineaPedido } from '../dominio/modelos/pedido.modelo';
import { RepositorioProductos, FiltroCatalogo } from '../dominio/contratos/repositorio-productos.contrato';

function catalogoInicial(): Producto[] {
  return [
    new Producto('PR001', 'Pollo a la brasa personal', 'plato', 1850, 12, 'NEG-001'),
    new Producto('PR002', 'Lomo saltado', 'plato', 2400, 8, 'NEG-001'),
    new Producto('PR003', 'Chicha morada', 'bebida', 500, 30, 'NEG-001'),
    new Producto('PR004', 'Arroz con leche', 'postre', 650, 10, 'NEG-001'),
    new Producto('PR005', 'Mazamorra morada', 'postre', 600, 0, 'NEG-001'),
    // Mismo ID en otro negocio: nunca debe aparecer en la carta de NEG-001.
    new Producto('PR001', 'Café americano', 'bebida', 700, 20, 'NEG-002'),
    new Producto('PR002', 'Torta de chocolate', 'postre', 900, 10, 'NEG-002'),
  ];
}

export class RepositorioProductosMemoria implements RepositorioProductos {
  private readonly productos = new Map<string, Producto>();

  constructor(iniciales: Producto[] = catalogoInicial()) {
    for (const producto of iniciales) {
      const clave = this.clave(producto.negocioId, producto.id);
      if (this.productos.has(clave)) throw new Error('Producto duplicado dentro del negocio');
      this.productos.set(clave, producto);
    }
  }

  async listar(negocioId: string, filtro?: FiltroCatalogo): Promise<Producto[]> {
    return [...this.productos.values()].filter((producto) => producto.negocioId === negocioId
      && (!filtro?.categoria || producto.categoria === filtro.categoria));
  }

  async buscarPorId(negocioId: string, id: string): Promise<Producto | null> {
    return this.productos.get(this.clave(negocioId, id)) ?? null;
  }

  async guardar(negocioId: string, producto: Producto): Promise<void> {
    if (producto.negocioId !== negocioId) throw new Error('El producto pertenece a otro negocio');
    this.productos.set(this.clave(negocioId, producto.id), producto);
  }

  // Operación interna síncrona: primero prepara todo, luego publica el cambio.
  // No hay await entre revisar y reservar: dos pedidos no consumen la misma unidad.
  reservarParaPedido<T>(negocioId: string, solicitudes: ReadonlyArray<{ productoId: string; cantidad: number }>,
    crearPedido: (lineas: ReadonlyArray<LineaPedido>) => T): T {
    if (!solicitudes.length) throw new Error('No se puede reservar un pedido vacío');
    if (new Set(solicitudes.map((linea) => linea.productoId)).size !== solicitudes.length) {
      throw new Error('No se admiten solicitudes de productos duplicados');
    }
    const cambios = solicitudes.map((solicitud) => {
      const actual = this.productos.get(this.clave(negocioId, solicitud.productoId));
      if (!actual) throw new Error('Producto no encontrado en este negocio');
      return { actual, nuevo: actual.descontar(solicitud.cantidad), cantidad: solicitud.cantidad };
    });
    const lineas = cambios.map(({ actual, cantidad }) => ({
      productoId: actual.id, nombre: actual.nombre,
      precioUnitarioCentimos: actual.precioCentimos, cantidad,
    }));
    // La entidad valida el pedido ANTES de modificar el stock de cualquier línea.
    const resultado = crearPedido(lineas);
    cambios.forEach(({ nuevo }) => this.productos.set(this.clave(negocioId, nuevo.id), nuevo));
    return resultado;
  }

  private clave(negocioId: string, id: string): string { return JSON.stringify([negocioId, id]); }
}
