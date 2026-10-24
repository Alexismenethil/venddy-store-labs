// INFRAESTRUCTURA · Ejemplo de contrato REST, sin backend configurado.
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Producto, Categoria } from '../dominio/modelos/producto.modelo';
import { RepositorioProductos, FiltroCatalogo } from '../dominio/contratos/repositorio-productos.contrato';

interface ProductoJson {
  id: string; nombre: string; categoria: Categoria; precioCentimos: number; stock: number; negocioId: string;
}

export class RepositorioProductosHttp implements RepositorioProductos {
  constructor(private readonly http: HttpClient, private readonly urlBase: string | null = null) {}

  async listar(negocioId: string, filtro?: FiltroCatalogo): Promise<Producto[]> {
    const params: Record<string, string> = {};
    if (filtro?.categoria) params['categoria'] = filtro.categoria;
    const respuesta = await firstValueFrom(this.http.get<ProductoJson[]>(this.ruta(negocioId), { params }));
    return respuesta.map((json) => this.aEntidad(negocioId, json));
  }

  async buscarPorId(negocioId: string, id: string): Promise<Producto | null> {
    try {
      const json = await firstValueFrom(this.http.get<ProductoJson>(`${this.ruta(negocioId)}/${encodeURIComponent(id)}`));
      return this.aEntidad(negocioId, json);
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 404) return null;
      throw error;
    }
  }

  async guardar(negocioId: string, producto: Producto): Promise<void> {
    if (producto.negocioId !== negocioId) throw new Error('El producto pertenece a otro negocio');
    await firstValueFrom(this.http.put(`${this.ruta(negocioId)}/${encodeURIComponent(producto.id)}`, {
      nombre: producto.nombre, categoria: producto.categoria,
      precioCentimos: producto.precioCentimos, stock: producto.stockDisponible,
    }));
  }

  private ruta(negocioId: string): string {
    if (!this.urlBase) throw new Error('API de productos sin configurar');
    return `${this.urlBase.replace(/\/$/, '')}/negocios/${encodeURIComponent(negocioId)}/productos`;
  }

  private aEntidad(negocioId: string, json: ProductoJson): Producto {
    if (json.negocioId !== negocioId) throw new Error('La API devolvió un producto de otro negocio');
    return new Producto(json.id, json.nombre, json.categoria, json.precioCentimos, json.stock, json.negocioId);
  }
}
