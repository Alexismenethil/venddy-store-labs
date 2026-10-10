# Venddy — Arquitectura Limpia con Angular

Curso: **IS-488 Arquitectura de Software** · UNSCH · 2026-II. Docente: Ing. Lizbeth Jaico Quispe.

Avance educativo de la Guía 003, adaptado a las mismas carpetas y responsabilidades del ejemplo **Marketplace-arquitSoft-02-ALEXIS**. Venddy gestiona cartas QR y pedidos de negocios de comida. Este boilerplate Angular 18 es una demostración independiente: no migra el sistema real Next.js / Express / Prisma ni conecta sus servicios.

## Puesta en marcha

Desde esta carpeta, con Node.js 20.19.x o 22.x y npm:

```bash
npm ci
npm test
npm run build
npm start
```

`npm test` y `npm run pruebas` ejecutan el dominio, los casos de uso y los adaptadores en memoria con TypeScript y Node, sin Angular ni navegador. `npm run test:angular` conserva el comando de Karma del proyecto generado, pero todavía no hay pruebas de componentes `.spec.ts`.

La aplicación funciona en `http://localhost:4200`. Para simular el contexto que lleva el enlace de una carta QR:

- Restaurante Killa: `http://localhost:4200/?negocio=NEG-001&mesa=1`.
- Cafetería Inti: `http://localhost:4200/?negocio=NEG-002&mesa=3`.

La carta permite filtrar por categoría y agregar productos. El carrito permite quitar líneas y confirmar el pedido para cocina. La confirmación muestra el precio vigente del repositorio, el estado **recibido** y el cobro pendiente en caja. No solicita tarjeta ni registra cobros desde la vista del comensal.

Los datos se guardan en memoria y se reinician al recargar. El comensal y los negocios de la demostración son datos ficticios; los parámetros de URL dan contexto, no autentican al usuario. No hay gestión de usuarios, panel de cocina, caja, generación de QR, persistencia ni sincronización entre navegadores en este avance.

## Las cuatro capas del ejemplo

```text
src/app/
├── dominio/
│   ├── modelos/
│   │   ├── producto.modelo.ts
│   │   ├── carrito.modelo.ts
│   │   ├── pedido.modelo.ts
│   │   └── precios.ts
│   └── contratos/
│       ├── repositorio-productos.contrato.ts
│       ├── repositorio-pedidos.contrato.ts
│       ├── registrador-cobros.contrato.ts
│       └── notificador-pedido.contrato.ts
├── aplicacion/
│   ├── consultar-catalogo.caso-uso.ts
│   ├── agregar-al-carrito.caso-uso.ts
│   └── registrar-pedido.caso-uso.ts
├── infraestructura/
│   ├── tokens.ts
│   ├── repositorio-productos-memoria.ts
│   ├── repositorio-productos-http.ts
│   ├── repositorio-pedidos-memoria.ts
│   ├── registrador-cobros-memoria.ts
│   ├── registrador-cobros-http.ts
│   ├── notificador-consola.ts
│   └── notificador-tiempo-real.ts
├── presentacion/
│   ├── estado-carrito.servicio.ts
│   ├── catalogo/catalogo.component.ts
│   └── carrito/carrito.component.ts
├── pruebas/dominio.pruebas.ts
├── app.config.ts
└── app.component.ts
```

1. **Dominio:** producto disponible, cantidades enteras, carrito de un negocio, importes en céntimos y estados del pedido. Define los contratos que necesita. No importa Angular ni infraestructura.
2. **Aplicación:** consulta la carta, agrega al carrito y coordina el registro. Solo importa dominio.
3. **Infraestructura:** implementa repositorios, registro interno de cobros y notificación. `tokens.ts` usa `InjectionToken` de Angular fuera del núcleo.
4. **Presentación:** componentes Angular que muestran carta y carrito. El servicio de estado comparte el carrito; los componentes piden al dominio los totales.

`app.config.ts` es la raíz de composición: elige los adaptadores y construye los casos de uso. La dependencia siempre apunta al dominio.

## Registrar un pedido

```text
CarritoComponent
  → RegistrarPedidoCasoUso.ejecutar()
      → validar negocio y carrito no vacío
      → RepositorioPedidos.registrarAtomico()
          → buscar productos actuales del negocio
          → verificar todas las cantidades y calcular precios en céntimos
          → crear Pedido recibido con líneas inmutables
          → reservar inventario y guardar juntos
      → NotificadorPedido.confirmarPedido()
      → devolver pedido y estado de entrega del aviso
```

El repositorio en memoria realiza su operación sin suspender la ejecución entre validar y escribir. Así, un error de una línea no deja descuentos parciales y dos pedidos concurrentes en la misma instancia no consumen la misma unidad. Cada clave de idempotencia pertenece a un negocio: el mismo intento devuelve el pedido anterior, y usarla con otros datos se rechaza. Un aviso fallido deja el pedido guardado y devuelve `avisoPendiente`; el caso de uso permite reintentar con la misma clave. La interfaz muestra ese estado, pero no incluye una pantalla de reintentos.

`Pedido` modela las transiciones `recibido → en_preparacion → listo → entregado`; solo un pedido recibido se puede cancelar. En este avance las transiciones se prueban en el dominio, sin panel operativo. La cancelación no implementa liberación de inventario: esa coordinación requiere su futuro caso de uso.

## Adaptadores y alcance

Se usan **productos y pedidos en memoria** y **avisos en consola**. Los precios de carta son precios finales, sin la comisión del marketplace y sin volver a añadir impuestos. El total del pedido usa datos del repositorio; el precio guardado en el carrito nunca se toma como autoridad.

`RegistradorCobros` tiene adaptadores en memoria y HTTP para mostrar la sustitución del contrato del ejemplo. Representa el **registro interno** de efectivo, Yape, Plin o tarjeta ya recibido por el negocio; no envía dinero ni integra una pasarela. Está registrado en la composición, pero **no interviene al confirmar un pedido**. Un futuro caso de uso de caja deberá autenticar al cajero, verificar el negocio y el saldo del pedido, registrar el cobro y actualizar su estado en una transacción. El adaptador aislado no cumple ese flujo completo.

`RepositorioProductosHttp`, `RegistradorCobrosHttp` y `NotificadorTiempoReal` son adaptadores ilustrativos, **sin URL ni servicios configurados**. Sus rutas muestran un contrato propuesto; no se presentan como endpoints existentes del producto real. El notificador de tiempo real publicaría un evento en un backend que luego lo distribuiría a cocina por WebSocket; aquí solo se entrega por consola.

Cambiar productos a HTTP requiere implementar también un repositorio de pedidos en el mismo backend con transacción de inventario y pedido, control de concurrencia e idempotencia. No se debe mezclar inventario remoto con el repositorio local. La atomicidad demostrada aquí corresponde a una instancia JavaScript en memoria, no a varios servidores. El backend futuro deberá obtener el tenant desde la sesión autorizada y verificar permisos, además de filtrar por negocio.

## Qué verifican las pruebas

Cantidades y precios inválidos, cálculo exacto en céntimos, inmutabilidad, estados del pedido, aislamiento entre negocios, disponibilidad de carta, stock y precios actuales, rechazos sin cambios parciales, concurrencia de la última unidad, idempotencia, avisos fallidos y registro de caja duplicado. Una prueba recorre las importaciones del núcleo y rechaza dependencias fuera del dominio.
