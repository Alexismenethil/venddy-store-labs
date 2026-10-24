// PRUEBAS · Dominio y casos de uso ejecutados con Node, sin Angular ni navegador.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { Producto } from '../dominio/modelos/producto.modelo';
import { Carrito } from '../dominio/modelos/carrito.modelo';
import { Pedido } from '../dominio/modelos/pedido.modelo';
import { formatearSoles } from '../dominio/modelos/precios';
import { NotificadorPedido } from '../dominio/contratos/notificador-pedido.contrato';
import { ConsultarCatalogoCasoUso } from '../aplicacion/consultar-catalogo.caso-uso';
import { AgregarAlCarritoCasoUso } from '../aplicacion/agregar-al-carrito.caso-uso';
import { RegistrarPedidoCasoUso } from '../aplicacion/registrar-pedido.caso-uso';
import { RepositorioProductosMemoria } from '../infraestructura/repositorio-productos-memoria';
import { RepositorioPedidosMemoria } from '../infraestructura/repositorio-pedidos-memoria';
import { RegistradorCobrosMemoria } from '../infraestructura/registrador-cobros-memoria';

let pasadas = 0;
async function prueba(nombre: string, fn: () => void | Promise<void>): Promise<void> {
  try { await fn(); pasadas++; console.log(`OK · ${nombre}`); }
  catch (error) { process.exitCode = 1; console.error(`FALLO · ${nombre}`, error); }
}

function producto(stock = 10, negocioId = 'N1', id = 'P1', precio = 1850): Producto {
  return new Producto(id, 'Pollo a la brasa', 'plato', precio, stock, negocioId);
}
class Avisador implements NotificadorPedido {
  falla = false;
  readonly pedidos = new Set<string>();
  async confirmarPedido(pedido: Pedido): Promise<void> {
    if (this.falla) throw new Error('Canal no disponible');
    this.pedidos.add(JSON.stringify([pedido.negocioId, pedido.id]));
  }
}
function entorno(iniciales = [producto()]) {
  const productos = new RepositorioProductosMemoria(iniciales);
  const pedidos = new RepositorioPedidosMemoria(productos);
  const avisador = new Avisador();
  const casoUso = new RegistrarPedidoCasoUso(pedidos, avisador);
  return { productos, pedidos, avisador, casoUso };
}
function comando(carrito: Carrito, claveIdempotencia = 'INTENTO-1', clienteId = 'C1', mesa = 1) {
  return { negocioId: carrito.negocioId, clienteId, mesa, carrito, claveIdempotencia };
}

async function main(): Promise<void> {
  console.log('Pruebas Venddy · sin Angular ni navegador\n');
  await prueba('precios y cantidades rechazan fracciones, NaN, infinito y cero', () => {
    for (const monto of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      assert.throws(() => producto(10, 'N1', 'P1', monto));
    }
    for (const cantidad of [0, -1, 1.5, NaN, Infinity]) {
      assert.throws(() => Carrito.vacio('N1').agregar(producto(), cantidad));
      assert.throws(() => producto().descontar(cantidad));
    }
  });
  await prueba('el descuento devuelve un producto nuevo y respeta el stock', () => {
    const original = producto(3);
    assert.equal(original.descontar(2).stockDisponible, 1);
    assert.equal(original.stockDisponible, 3);
    assert.throws(() => original.descontar(4), /Stock insuficiente/);
    assert(Object.isFrozen(original));
  });
  await prueba('el carrito acumula cantidades sin mutar la instancia anterior', () => {
    const anterior = Carrito.vacio('N1').agregar(producto(5), 2);
    const siguiente = anterior.agregar(producto(5), 3);
    assert.equal(anterior.cantidadDeItems, 2); assert.equal(siguiente.cantidadDeItems, 5);
    assert.equal(siguiente.items.length, 1);
    assert(Object.isFrozen(siguiente.items)); assert(Object.isFrozen(siguiente.items[0]));
    assert.throws(() => siguiente.agregar(producto(5), 1), /Stock insuficiente/);
  });
  await prueba('un carrito no mezcla negocios aunque el producto tenga el mismo ID', () => {
    assert.throws(() => Carrito.vacio('N1').agregar(producto(10, 'N2'), 1), /otro negocio/);
  });
  await prueba('los importes usan céntimos sin comisión ni impuesto añadido', () => {
    const carrito = Carrito.vacio('N1').agregar(producto(10, 'N1', 'P1', 10), 3);
    assert.equal(carrito.calcularTotal(), 30); assert.equal(formatearSoles(30), '0.30');
    assert.throws(() => Carrito.vacio('N1').agregar(producto(2, 'N1', 'P1', Number.MAX_SAFE_INTEGER), 2));
    assert.throws(() => Carrito.vacio('N1').agregar(producto(1, 'N1', 'P1', Number.MAX_SAFE_INTEGER), 1)
      .agregar(producto(1, 'N1', 'P2', 1), 1), /límite/);
  });
  await prueba('el pedido nace recibido y admite solo el orden correcto de cocina', () => {
    const pedido = Pedido.crear('PED1', 'N1', 'C1', 1,
      [{ productoId: 'P1', nombre: 'Pollo', precioUnitarioCentimos: 1850, cantidad: 2 }], 'K1');
    assert.equal(pedido.estadoActual, 'recibido'); assert.equal(pedido.totalCentimos, 3700);
    assert.throws(() => pedido.entregar(), /no puede/);
    const preparado = pedido.iniciarPreparacion();
    assert.throws(() => preparado.cancelar(), /no puede/);
    assert.equal(preparado.marcarListo().entregar().estadoActual, 'entregado');
    assert.equal(pedido.cancelar().estadoActual, 'cancelado');
    assert.throws(() => pedido.cancelar().cancelar(), /no puede/);
  });
  await prueba('la carta excluye agotados y los productos de otro negocio', async () => {
    const { productos } = entorno([producto(), producto(0, 'N1', 'P2'), producto(9, 'N2')]);
    const carta = await new ConsultarCatalogoCasoUso(productos).ejecutar('N1');
    assert.equal(carta.length, 1); assert.equal(carta[0].negocioId, 'N1');
    assert.equal((await new ConsultarCatalogoCasoUso(productos).ejecutar('N1', { categoria: 'bebida' })).length, 0);
  });
  await prueba('agregar busca dentro del negocio y usa el producto del repositorio', async () => {
    const { productos } = entorno([producto(4), producto(8, 'N2', 'OTRO')]);
    const agregar = new AgregarAlCarritoCasoUso(productos);
    const carrito = await agregar.ejecutar({ carritoActual: Carrito.vacio('N1'), productoId: 'P1', cantidad: 2 });
    assert.equal(carrito.calcularTotal(), 3700);
    await assert.rejects(agregar.ejecutar({ carritoActual: carrito, productoId: 'OTRO', cantidad: 1 }), /no encontrado/);
  });
  await prueba('guardar un producto no permite escribir en otro negocio', async () => {
    const { productos } = entorno();
    await assert.rejects(productos.guardar('N2', producto()), /otro negocio/);
  });
  await prueba('registrar pedido guarda, reserva stock y avisa sin cobrar', async () => {
    const e = entorno();
    const resultado = await e.casoUso.ejecutar(comando(Carrito.vacio('N1').agregar(producto(), 2)));
    assert.equal(resultado.pedido.estadoActual, 'recibido'); assert.equal(resultado.pedido.totalCentimos, 3700);
    assert.equal(resultado.avisoPendiente, false); assert.equal(e.avisador.pedidos.size, 1);
    assert.equal((await e.productos.buscarPorId('N1', 'P1'))!.stockDisponible, 8);
    assert.equal((await e.pedidos.listarPorCliente('N1', 'C1')).length, 1);
  });
  await prueba('el precio del pedido se relee del inventario y no confía en el carrito', async () => {
    const e = entorno([producto(5, 'N1', 'P1', 2400)]);
    const carrito = Carrito.vacio('N1').agregar(producto(50, 'N1', 'P1', 1), 2);
    const { pedido } = await e.casoUso.ejecutar(comando(carrito));
    assert.equal(pedido.totalCentimos, 4800); assert.equal(pedido.lineas[0].precioUnitarioCentimos, 2400);
    await e.productos.guardar('N1', producto(5, 'N1', 'P1', 3000));
    assert.equal(pedido.totalCentimos, 4800); assert(Object.isFrozen(pedido.lineas[0]));
  });
  await prueba('stock insuficiente en una línea no deja descuentos parciales', async () => {
    const e = entorno([producto(5), producto(0, 'N1', 'P2')]);
    const carrito = Carrito.vacio('N1').agregar(producto(5), 2).agregar(producto(5, 'N1', 'P2'), 1);
    await assert.rejects(e.casoUso.ejecutar(comando(carrito)), /Stock insuficiente/);
    assert.equal((await e.productos.buscarPorId('N1', 'P1'))!.stockDisponible, 5);
    assert.equal((await e.pedidos.listarPorCliente('N1', 'C1')).length, 0);
  });
  await prueba('mesa inválida se rechaza antes de reservar stock', async () => {
    const e = entorno();
    await assert.rejects(e.casoUso.ejecutar(comando(Carrito.vacio('N1').agregar(producto(), 1), 'K1', 'C1', 0)), /mesa/);
    assert.equal((await e.productos.buscarPorId('N1', 'P1'))!.stockDisponible, 10);
  });
  await prueba('carrito vacío y negocio incompatible se rechazan', async () => {
    const e = entorno();
    await assert.rejects(e.casoUso.ejecutar(comando(Carrito.vacio('N1'))), /vacío/);
    await assert.rejects(e.casoUso.ejecutar({ ...comando(Carrito.vacio('N1').agregar(producto(), 1)), negocioId: 'N2' }), /otro negocio/);
  });
  await prueba('repetir un intento devuelve el mismo pedido y consume stock una sola vez', async () => {
    const e = entorno(); const entrada = comando(Carrito.vacio('N1').agregar(producto(), 2));
    const [a, b] = await Promise.all([e.casoUso.ejecutar(entrada), e.casoUso.ejecutar(entrada)]);
    assert.equal(a.pedido.id, b.pedido.id);
    assert.equal((await e.productos.buscarPorId('N1', 'P1'))!.stockDisponible, 8);
    assert.equal((await e.pedidos.listarPorCliente('N1', 'C1')).length, 1); assert.equal(e.avisador.pedidos.size, 1);
  });
  await prueba('una clave reutilizada con cantidades distintas se rechaza', async () => {
    const e = entorno();
    await e.casoUso.ejecutar(comando(Carrito.vacio('N1').agregar(producto(), 1)));
    await assert.rejects(e.casoUso.ejecutar(comando(Carrito.vacio('N1').agregar(producto(), 2))), /otros datos/);
    assert.equal((await e.productos.buscarPorId('N1', 'P1'))!.stockDisponible, 9);
  });
  await prueba('dos pedidos concurrentes no pueden consumir la última unidad', async () => {
    const e = entorno([producto(1)]); const carrito = Carrito.vacio('N1').agregar(producto(1), 1);
    const resultados = await Promise.allSettled([e.casoUso.ejecutar(comando(carrito, 'A')), e.casoUso.ejecutar(comando(carrito, 'B'))]);
    assert.equal(resultados.filter((r) => r.status === 'fulfilled').length, 1);
    assert.equal((await e.productos.buscarPorId('N1', 'P1'))!.stockDisponible, 0);
    assert.equal((await e.pedidos.listarPorCliente('N1', 'C1')).length, 1);
  });
  await prueba('idempotencia y consultas de pedidos están aisladas por negocio', async () => {
    const e = entorno([producto(5), producto(5, 'N2')]);
    const a = await e.casoUso.ejecutar(comando(Carrito.vacio('N1').agregar(producto(5), 1)));
    const b = await e.casoUso.ejecutar(comando(Carrito.vacio('N2').agregar(producto(5, 'N2'), 1)));
    assert.notEqual(a.pedido.id, b.pedido.id);
    assert.equal(await e.pedidos.buscarPorId('N2', a.pedido.id), null);
    assert.equal((await e.pedidos.listarPorCliente('N1', 'C1')).length, 1);
    assert.equal((await e.pedidos.listarPorCliente('N2', 'C1')).length, 1);
  });
  await prueba('fallar el aviso mantiene el pedido; reintentar no duplica stock ni pedido', async () => {
    const e = entorno(); e.avisador.falla = true;
    const entrada = comando(Carrito.vacio('N1').agregar(producto(), 1));
    const primero = await e.casoUso.ejecutar(entrada);
    assert.equal(primero.avisoPendiente, true);
    e.avisador.falla = false;
    const segundo = await e.casoUso.ejecutar(entrada);
    assert.equal(segundo.avisoPendiente, false); assert.equal(primero.pedido.id, segundo.pedido.id);
    assert.equal((await e.productos.buscarPorId('N1', 'P1'))!.stockDisponible, 9);
  });
  await prueba('el adaptador de caja registra una referencia una vez y no mueve dinero', async () => {
    const caja = new RegistradorCobrosMemoria();
    const entrada = { negocioId: 'N1', pedidoId: 'PED1', montoCentimos: 1850, medio: 'efectivo' as const, referencia: 'CAJA-1' };
    assert.deepEqual(await caja.registrarCobro(entrada), await caja.registrarCobro(entrada));
    await assert.rejects(caja.registrarCobro({ ...entrada, montoCentimos: 2000 }), /otro registro/);
    await assert.rejects(caja.registrarCobro({ ...entrada, pedidoId: 'PED2', montoCentimos: 1.5 }), /céntimos/);
  });
  await prueba('el núcleo solo importa archivos del dominio y permanece ajeno a Angular', () => {
    const base = resolve('src/app'); const dominio = join(base, 'dominio');
    function verificar(carpeta: string): void {
      for (const entrada of readdirSync(carpeta, { withFileTypes: true })) {
        const ruta = join(carpeta, entrada.name);
        if (entrada.isDirectory()) verificar(ruta);
        else if (ruta.endsWith('.ts')) {
          const fuente = readFileSync(ruta, 'utf8');
          for (const coincidencia of fuente.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
            const destino = resolve(carpeta, coincidencia[1]);
            assert(!relative(dominio, destino).startsWith('..'), `${ruta} importa ${coincidencia[1]} fuera del dominio`);
          }
        }
      }
    }
    verificar(dominio); verificar(join(base, 'aplicacion'));
  });
  console.log(`\n${pasadas} pruebas aprobadas.`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
