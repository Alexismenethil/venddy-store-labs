# Diseño interno de Pedidos

![Clases y contratos de Pedidos](../../../img/nivel4-clases.png)

| Pieza | Responsabilidad |
|---|---|
| `Carrito` | Selección inmutable de un negocio; cantidades y total tentativo. |
| `Producto` | Categoría, precio en céntimos, stock y pertenencia empresarial. |
| `Pedido` / `LineaPedido` | Identidad, negocio, mesa, líneas confirmadas, total y estados. `LineaPedido` es interfaz, no una clase separada. |
| `RegistrarPedidoCasoUso` | Valida contexto y carrito, solicita registro y después avisa. |
| `RepositorioPedidos` / `RegistroPedido` | Contrato de registro atómico, consulta e idempotencia por negocio; datos de entrada. |
| `NotificadorPedido` | Contrato para avisar de un pedido confirmado. |
| Adaptadores | Implementan persistencia/avisos fuera de las reglas del núcleo. |

![Secuencia del registro](../../../img/nivel4-secuencia.png)

Primero se reconoce un intento existente. Para un pedido nuevo se releen precios/stock y se validan todas las líneas antes de escribir. Pedido y reserva se conservan juntos. El fallo del aviso no deshace un registro confirmado. El cobro es otro caso de uso de Caja.

En la demostración, `RepositorioPedidosMemoria` coordina con `RepositorioProductosMemoria` sin suspender la operación entre validar y escribir. Esa atomicidad es local a una instancia JavaScript. Un adaptador PostgreSQL deberá garantizar transacción, restricciones y concurrencia reales.

El pedido pasa por recibido, en preparación, listo y entregado; en la demostración solo se cancela desde recibido y no devuelve stock. La anulación completa es RF-14.

## Módulo en el backend

```text
src/modules/pedidos/
├── dominio/           Pedido, estados y contratos
├── aplicacion/        Registrar y anular pedido; cambiar preparación
├── infraestructura/   Repositorio Prisma y aviso Socket.IO
├── presentacion/      Controlador y rutas /api/v1/pedidos
├── pedidos.module.ts  Raíz de composición del módulo
└── index.ts           API pública para otros módulos
```

[Dependencias permitidas](../../02-arquitectura-software/enfoque-aquitectonico.md). Los otros módulos usan solo `index.ts`.

| Paso | Capa | `POST /api/v1/pedidos` |
|---|---|---|
| 1 | Presentación | Resuelve el negocio; valida entrada, token de mesa y clave de idempotencia. |
| 2 | Aplicación | `RegistrarPedidoCasoUso` abre la unidad de trabajo. |
| 3 | Infraestructura | Busca la clave: mismo contenido devuelve el pedido anterior; otro contenido se rechaza. |
| 4 | Aplicación | Pide precios a Catálogo y reserva stock en Inventario por sus contratos. |
| 5 | Dominio | `Pedido` valida líneas y calcula el total en céntimos. |
| 6 | Infraestructura | Guarda pedido, líneas, clave y tickets; confirma la transacción. |
| 7 | Aplicación | Avisa a cocina después de confirmar; un fallo no deshace el pedido. |
| 8 | Presentación | Responde `201`, o `200` si era un reintento. |

| Ruta crítica | Actor | Respuestas |
|---|---|---|
| `GET /api/v1/carta` | Público | 200, 404 |
| `POST /api/v1/pedidos` | Comensal con token de mesa | 201, 200, 409, 422, 429 |
| `GET /api/v1/pedidos/:id` | Comensal del pedido | 200, 404 |
| `PATCH /api/v1/pedidos/:id/estado` | Preparación | 200, 403, 409 |
| `POST /api/v1/pedidos/:id/cobro` | Caja | 201, 403, 409 |
| `POST /api/v1/pedidos/:id/anulacion` | Caja | 200, 403, 409 |

409: clave usada con otro contenido o estado no permitido. 422: datos rechazados o sin stock. 429: límite de pedidos.

[Patrones](patrones-de-diseño.md) · [SOLID](principios-de-diseño.md) · [C4](../../04-modelo-c4/Nivel4-DiagramadeCodigo.md).
