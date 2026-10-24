// INFRAESTRUCTURA · Adaptador ilustrativo de caja. No hay endpoint configurado.
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RegistradorCobros, RegistroCobro, ResultadoCobro } from '../dominio/contratos/registrador-cobros.contrato';

export class RegistradorCobrosHttp implements RegistradorCobros {
  constructor(private readonly http: HttpClient, private readonly urlBase: string | null = null) {}

  async registrarCobro(registro: RegistroCobro): Promise<ResultadoCobro> {
    if (!this.urlBase) throw new Error('API de cobros internos sin configurar');
    // El backend debe autenticar al cajero y verificar negocio, monto e idempotencia.
    return firstValueFrom(this.http.post<ResultadoCobro>(
      `${this.urlBase.replace(/\/$/, '')}/negocios/${encodeURIComponent(registro.negocioId)}/pedidos/${encodeURIComponent(registro.pedidoId)}/cobro`,
      { montoCentimos: registro.montoCentimos, medio: registro.medio, referencia: registro.referencia }));
  }
}
