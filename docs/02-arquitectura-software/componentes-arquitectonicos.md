# Componentes de Venddy

![Componentes de la API](../../img/nivel3-componentes.png)

| Módulo | Responsabilidad | Origen |
|---|---|---|
| Catálogo y carta | Productos, precios, disponibilidad y consulta QR. | RF-01–03 |
| Pedidos y cocina | Confirmación, idempotencia, estaciones, estados, seguimiento y anulación. | RF-04–06, 13–14 |
| Caja y ventas | Turno, medios de pago recibidos, cierre y nota interna. | RF-07–08 |
| Inventario | Existencias, movimientos y ajustes autorizados. | RF-09, 14 |
| Administración | Configuración y permisos del negocio. | RF-02, 07, 09 |
| Plataforma SaaS | Negocios, planes y visitas de soporte. | RF-11 |
| Fidelidad | Beneficios opcionales por negocio tras cobros elegibles. | RF-12 |
| Reportes | Consultas y exportaciones autorizadas. | RF-10 |

Pedidos consulta Catálogo y coordina la reserva de Inventario. Caja registra el cobro posterior y comunica beneficios a Fidelidad. Los eventos se distribuyen después de confirmar; Reportes consulta servicios autorizados. La entrada REST y de eventos resuelve empresa y permisos antes de delegar. [C3](../04-modelo-c4/Nivel3-Diagrama-de-Componentes.md).
