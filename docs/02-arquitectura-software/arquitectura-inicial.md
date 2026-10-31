# Arquitectura inicial de Venddy

**Estilo:** monolito modular. **Enfoque:** Clean Architecture.

[Diagrama interactivo de la arquitectura objetivo — Archify](arquitectura-archify.html). Descargar el HTML y abrirlo en el navegador; incluye el visor y sus recursos.

![Arquitectura general](../../img/nivel2-contenedores.png)

| Elemento | Función |
|---|---|
| Next.js / React | Carta QR y pantallas de cocina, caja y administración. |
| API Express / Socket.IO | Autorización, casos de uso y comunicación por negocio. |
| Prisma / PostgreSQL en Neon | Persistencia y transacciones de pedidos, cobros y stock. |
| Almacenamiento de objetos | Fotografías y archivos; PostgreSQL conserva sus referencias. |

La API conserva empresa y permisos en cada operación. Confirma el registro antes de avisar; al reconectar, los clientes recuperan el estado por REST. Las credenciales permanecen en el servidor.

## Datos y recuperación

| Módulo | Datos propios |
|---|---|
| Catálogo y carta | Categorías, productos, variantes, precios, fotos, mesas y tokens QR. |
| Pedidos y cocina | Pedidos, líneas, claves de idempotencia, tickets por estación y estados. |
| Inventario | Existencias por producto y topping; movimientos. |
| Caja y ventas | Turnos, cobros, medios de pago, notas internas y cierres. |
| Administración | Personal, permisos y configuración del negocio. |
| Plataforma SaaS | Negocios, planes, suscripciones y visitas de soporte. |
| Fidelidad | Programas, clientes y beneficios. |
| Reportes | Sin tablas propias; consulta contratos de lectura. |

| Operación atómica | Se confirma junto |
|---|---|
| Confirmar pedido | Pedido, líneas, clave, tickets, reserva de stock y movimiento. |
| Cobrar | Cobro, medios de pago, nota interna, estado del pedido y beneficio. |
| Anular pedido | Estado, devolución de stock y movimiento con motivo y autor. |
| Ajustar stock | Existencia y movimiento. |

Cada módulo escribe solo sus tablas; el caso de uso abre la transacción por una unidad de trabajo ([ADR-007](../01-analisis-de-sistema/07-decisiones-arquitectonicas.md)).

PostgreSQL atiende la operación. Las fotografías usan almacenamiento de objetos; R2 es el objetivo. Las copias deben conservarse en un espacio privado con permisos separados.

La base de recuperación propuesta permite restaurar y validar copias en un entorno aislado bajo demanda. No recibe tráfico comercial ni implica réplica activa o conmutación automática. Los objetivos RPO 24 h y RTO 2 h requieren ensayos de restauración.

[Componentes](componentes-arquitectonicos.md) · [Estilo](estilo-arquitectonico.md) · [Enfoque](enfoque-aquitectonico.md).
