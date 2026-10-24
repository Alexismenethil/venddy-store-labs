// INFRAESTRUCTURA · Registro contable de ejemplo para caja, sin pasarela.
import { RegistradorCobros, RegistroCobro, ResultadoCobro } from '../dominio/contratos/registrador-cobros.contrato';
import { validarCentimos } from '../dominio/modelos/precios';

export class RegistradorCobrosMemoria implements RegistradorCobros {
  private readonly cobros = new Map<string, { huella: string; resultado: ResultadoCobro }>();

  async registrarCobro(registro: RegistroCobro): Promise<ResultadoCobro> {
    if (!registro.negocioId.trim() || !registro.pedidoId.trim() || !registro.referencia.trim()) {
      throw new Error('El registro de cobro requiere negocio, pedido y referencia');
    }
    validarCentimos(registro.montoCentimos);
    if (!['efectivo', 'yape', 'plin', 'tarjeta'].includes(registro.medio)) throw new Error('Medio de cobro no permitido');
    const clave = JSON.stringify([registro.negocioId, registro.pedidoId]);
    const huella = JSON.stringify([registro.montoCentimos, registro.medio, registro.referencia]);
    const anterior = this.cobros.get(clave);
    if (anterior) {
      if (anterior.huella !== huella) throw new Error('Este pedido ya tiene otro registro de cobro');
      return anterior.resultado;
    }
    const resultado = Object.freeze({ registroId: `COB-${String(this.cobros.size + 1).padStart(6, '0')}` });
    this.cobros.set(clave, { huella, resultado });
    return resultado;
  }
}
