// RAÍZ DE COMPOSICIÓN · Aquí se eligen los adaptadores concretos.
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { REPOSITORIO_PRODUCTOS, REPOSITORIO_PEDIDOS, REGISTRADOR_COBROS, NOTIFICADOR_PEDIDO } from './infraestructura/tokens';
import { RepositorioProductosMemoria } from './infraestructura/repositorio-productos-memoria';
import { RepositorioPedidosMemoria } from './infraestructura/repositorio-pedidos-memoria';
import { RegistradorCobrosMemoria } from './infraestructura/registrador-cobros-memoria';
import { NotificadorConsola } from './infraestructura/notificador-consola';
import { ConsultarCatalogoCasoUso } from './aplicacion/consultar-catalogo.caso-uso';
import { AgregarAlCarritoCasoUso } from './aplicacion/agregar-al-carrito.caso-uso';
import { RegistrarPedidoCasoUso } from './aplicacion/registrar-pedido.caso-uso';
import { RepositorioProductos } from './dominio/contratos/repositorio-productos.contrato';
import { RepositorioPedidos } from './dominio/contratos/repositorio-pedidos.contrato';
import { NotificadorPedido } from './dominio/contratos/notificador-pedido.contrato';

// Los adaptadores HTTP y de tiempo real se incluyen como ejemplos sin URL.
// Activarlos requiere además implementar un repositorio de pedidos transaccional
// en el backend. El inventario HTTP no se mezcla con pedidos en memoria.
// import { RepositorioProductosHttp } from './infraestructura/repositorio-productos-http';
// import { RegistradorCobrosHttp } from './infraestructura/registrador-cobros-http';
// import { NotificadorTiempoReal } from './infraestructura/notificador-tiempo-real';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    { provide: REPOSITORIO_PRODUCTOS, useFactory: () => new RepositorioProductosMemoria() },
    {
      provide: REPOSITORIO_PEDIDOS,
      useFactory: (productos: RepositorioProductosMemoria) => new RepositorioPedidosMemoria(productos),
      deps: [REPOSITORIO_PRODUCTOS],
    },
    { provide: REGISTRADOR_COBROS, useFactory: () => new RegistradorCobrosMemoria() },
    { provide: NOTIFICADOR_PEDIDO, useFactory: () => new NotificadorConsola() },
    {
      provide: ConsultarCatalogoCasoUso,
      useFactory: (productos: RepositorioProductos) => new ConsultarCatalogoCasoUso(productos),
      deps: [REPOSITORIO_PRODUCTOS],
    },
    {
      provide: AgregarAlCarritoCasoUso,
      useFactory: (productos: RepositorioProductos) => new AgregarAlCarritoCasoUso(productos),
      deps: [REPOSITORIO_PRODUCTOS],
    },
    {
      provide: RegistrarPedidoCasoUso,
      useFactory: (pedidos: RepositorioPedidos, notificador: NotificadorPedido) => new RegistrarPedidoCasoUso(pedidos, notificador),
      deps: [REPOSITORIO_PEDIDOS, NOTIFICADOR_PEDIDO],
    },
  ],
};
