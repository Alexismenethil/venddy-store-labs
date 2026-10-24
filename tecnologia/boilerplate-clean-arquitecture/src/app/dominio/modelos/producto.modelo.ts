// DOMINIO · Producto de la carta de un negocio, sin dependencias de Angular.
import { validarCentimos } from './precios';

export const CATEGORIAS_PERMITIDAS = ['plato', 'bebida', 'postre'] as const;
export type Categoria = (typeof CATEGORIAS_PERMITIDAS)[number];

export class Producto {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly categoria: Categoria,
    public readonly precioCentimos: number,
    private readonly stock: number,
    public readonly negocioId: string,
  ) {
    if (!id.trim()) throw new Error('Todo producto debe tener un identificador');
    if (nombre.trim().length < 3) throw new Error('El nombre debe tener al menos 3 caracteres');
    if (!CATEGORIAS_PERMITIDAS.includes(categoria)) throw new Error('Categoría no permitida');
    validarCentimos(precioCentimos);
    if (!Number.isSafeInteger(stock) || stock < 0) throw new Error('El stock debe ser un entero no negativo');
    if (!negocioId.trim()) throw new Error('Todo producto debe pertenecer a un negocio');
    Object.freeze(this);
  }

  get stockDisponible(): number { return this.stock; }
  estaDisponible(): boolean { return this.stock > 0; }

  hayStockPara(cantidad: number): boolean {
    return Number.isSafeInteger(cantidad) && cantidad > 0 && this.stock >= cantidad;
  }

  // Devuelve una entidad nueva: un carrito no puede mutar el inventario.
  descontar(cantidad: number): Producto {
    if (!this.hayStockPara(cantidad)) throw new Error(`Stock insuficiente para ${this.nombre}`);
    return new Producto(this.id, this.nombre, this.categoria, this.precioCentimos, this.stock - cantidad, this.negocioId);
  }
}
