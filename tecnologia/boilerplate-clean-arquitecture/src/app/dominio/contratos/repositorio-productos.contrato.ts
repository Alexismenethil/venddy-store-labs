// DOMINIO · Cada consulta debe incluir el negocio; nunca se lista toda la plataforma.
import { Producto } from '../modelos/producto.modelo';

export interface FiltroCatalogo { categoria?: string; }
export interface RepositorioProductos {
  listar(negocioId: string, filtro?: FiltroCatalogo): Promise<Producto[]>;
  buscarPorId(negocioId: string, id: string): Promise<Producto | null>;
  guardar(negocioId: string, producto: Producto): Promise<void>;
}
