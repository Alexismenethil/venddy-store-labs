// DOMINIO · Los precios de carta ya son finales; no se añade comisión ni IGV.
// Todo cálculo usa céntimos enteros para evitar errores de punto flotante.
export function validarCentimos(monto: number): void {
  if (!Number.isSafeInteger(monto) || monto <= 0) {
    throw new Error('El precio debe ser un entero de céntimos mayor que cero');
  }
}

export function importeEnCentimos(precioCentimos: number, cantidad: number): number {
  validarCentimos(precioCentimos);
  if (!Number.isSafeInteger(cantidad) || cantidad <= 0) {
    throw new Error('La cantidad debe ser un entero mayor que cero');
  }
  const importe = precioCentimos * cantidad;
  validarCentimos(importe);
  return importe;
}

export function formatearSoles(centimos: number): string {
  if (!Number.isSafeInteger(centimos) || centimos < 0) {
    throw new Error('El monto debe ser un entero de céntimos no negativo');
  }
  return (centimos / 100).toFixed(2);
}
