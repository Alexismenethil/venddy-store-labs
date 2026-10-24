# Enfoque único: Clean Architecture

![Clean Architecture de Venddy](../../img/ArquitecturalimpiadeVenddyWeb.png)

El diagrama relaciona las reglas, los casos de uso y los mecanismos externos con las cuatro responsabilidades del ejemplo. La raíz de composición conecta implementaciones fuera del núcleo.

| Responsabilidad | Venddy | Dependencia permitida |
|---|---|---|
| Dominio | Producto, Carrito, Pedido, importes, stock, estados y contratos. | Elementos del propio núcleo. |
| Aplicación | Consultar carta, agregar al carrito y registrar pedido; coordinación de operaciones. | Dominio y sus contratos. |
| Presentación | Carta y carrito; en el backend propuesto, controladores y entradas autorizadas. | Aplicación y tipos del núcleo. |
| Infraestructura | Repositorios, transacciones y adaptadores de avisos, archivos y cobros. | Contratos del núcleo que implementa. |

Dominio y Aplicación no importan Angular, Express, Prisma ni SDK de proveedores. La raíz de composición conecta implementaciones; no pertenece al dominio.

En el ejemplo, los contratos están en `dominio/contratos/`. El caso de uso recibe `RepositorioPedidos` y `NotificadorPedido`; las implementaciones en memoria/consola se eligen en `app.config.ts`. Prisma/PostgreSQL y Socket.IO corresponden al diseño del sistema, no a una conexión activa de la demostración.

ADR-002 responde a DA04 y AC05. El estilo monolito modular define cómo se organiza/despliega el backend; Clean define sus responsabilidades y dependencias.

[SVG](../../img/fuentes-svg/ArquitecturalimpiadeVenddyWeb.svg) · [Diseño de Pedidos](../03-diseño-de-software/diseño-interno/diseño-interno-de-modulos.md).
