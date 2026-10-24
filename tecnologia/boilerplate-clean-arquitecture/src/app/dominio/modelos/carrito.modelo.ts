// DOMINIO · Carrito inmutable que pertenece a un solo negocio.
import { Producto } from './producto.modelo';
import { importeEnCentimos } from './precios';

export interface LineaCarrito {
  readonly producto: Producto;
  readonly cantidad: number;
}

export class Carrito {
  private constructor(public readonly negocioId: string, private readonly lineas: ReadonlyArray<LineaCarrito>) {
    Object.freeze(this);
  }

  static vacio(negocioId: string): Carrito {
    if (!negocioId.trim()) throw new Error('El carrito debe pertenecer a un negocio');
    return new Carrito(negocioId, Object.freeze([]));
  }

  get items(): ReadonlyArray<LineaCarrito> { return this.lineas; }
  get cantidadDeItems(): number { return this.lineas.reduce((suma, linea) => suma + linea.cantidad, 0); }
  estaVacio(): boolean { return this.lineas.length === 0; }

  agregar(producto: Producto, cantidad: number): Carrito {
    if (producto.negocioId !== this.negocioId) throw new Error('El producto pertenece a otro negocio');
    if (!Number.isSafeInteger(cantidad) || cantidad <= 0) throw new Error('La cantidad debe ser un entero mayor que cero');
    const existente = this.lineas.find((linea) => linea.producto.id === producto.id);
    const cantidadFinal = (existente?.cantidad ?? 0) + cantidad;
    if (!producto.hayStockPara(cantidadFinal)) throw new Error(`Stock insuficiente para ${producto.nombre}`);
    const nueva = Object.freeze({ producto, cantidad: cantidadFinal });
    const lineas = existente
      ? this.lineas.map((linea) => linea.producto.id === producto.id ? nueva : linea)
      : [...this.lineas, nueva];
    const carrito = new Carrito(this.negocioId, Object.freeze(lineas));
    carrito.calcularTotal(); // También evita desbordar la suma de importes.
    return carrito;
  }

  quitar(productoId: string): Carrito {
    return new Carrito(this.negocioId, Object.freeze(this.lineas.filter((linea) => linea.producto.id !== productoId)));
  }

  vaciar(): Carrito { return Carrito.vacio(this.negocioId); }
  importeLinea(linea: LineaCarrito): number { return importeEnCentimos(linea.producto.precioCentimos, linea.cantidad); }

  calcularTotal(): number {
    const total = this.lineas.reduce((suma, linea) => suma + this.importeLinea(linea), 0);
    if (!Number.isSafeInteger(total)) throw new Error('El total excede el límite de céntimos');
    return total;
  }
}
