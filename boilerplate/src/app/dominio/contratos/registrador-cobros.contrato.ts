// DOMINIO · Registro interno de caja. No es una pasarela ni mueve dinero.
export type MedioCobro = 'efectivo' | 'yape' | 'plin' | 'tarjeta';
export interface RegistroCobro {
  negocioId: string;
  pedidoId: string;
  montoCentimos: number;
  medio: MedioCobro;
  referencia: string;
}
export interface ResultadoCobro { registroId: string; }
export interface RegistradorCobros {
  // El futuro flujo de caja verifica rol, pedido y monto pendiente antes de llamar.
  // Un mismo negocio + pedido solo admite un registro de cobro completo.
  registrarCobro(registro: RegistroCobro): Promise<ResultadoCobro>;
}
