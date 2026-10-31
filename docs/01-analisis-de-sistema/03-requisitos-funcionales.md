# Requisitos funcionales

| ID | Requisito de Venddy | Criterio de aceptación | Iteración |
|---|---|---|---|
| RF-01 | Identificar el negocio por su subdominio registrado en `venddy.store`. | Cada negocio muestra su carta; un subdominio inexistente se rechaza. | 1 |
| RF-02 | Administrar catálogo con foto, descripción, variantes (tamaño, sabor, topping), precios y disponibilidad, con permisos. | El cambio autorizado afecta solo al negocio correspondiente y aparece en la carta en 20 s o menos. | 1 |
| RF-03 | Consultar carta y formar pedido desde navegador sin registro obligatorio, mediante QR con token opaco por mesa. | Un token inválido o regenerado no permite pedir; se limitan los pedidos por minuto. | 1 |
| RF-04 | Recalcular precios, promociones y stock en el servidor. | Alterar el total del navegador no altera el confirmado; un rechazo no reserva parcialmente. | 1 |
| RF-05 | Reconocer una clave de idempotencia acotada al negocio, con vigencia definida. | Misma clave y contenido durante su vigencia: un pedido y una reserva; contenido distinto: rechazo. | 1 |
| RF-06 | Distribuir comandas por estación y actualizar estados. | Solo las estaciones autorizadas del negocio reciben el pedido; un aviso perdido se recupera en 30 s o menos. | 1 |
| RF-07 | Gestionar turno, edición autorizada, cobros con uno o varios medios de pago, arqueo y cierre. | Los medios suman el importe cobrado; validar permisos y conservar movimientos y diferencias. | 1 |
| RF-08 | Generar una nota de venta interna asociada al cobro. | El documento conserva importes y se identifica como nota interna, sin validación SUNAT. | 1 |
| RF-09 | Controlar stock por producto y topping, sin recetas, con ajustes y movimientos trazables. | No aceptar stock negativo ni ajustes sin permiso; conservar autoría y negocio. | 1 |
| RF-10 | Consultar y exportar reportes autorizados por intervalo. | Rango, negocio e importes coinciden con las operaciones persistidas. | 2 |
| RF-11 | Administrar negocios, planes, estado y visitas de soporte. | Slug único y acceso transversal reservado a plataforma/soporte autorizado. | 2 |
| RF-12 | Ofrecer fidelidad opcional con reglas por empresa. | Un cobro elegible acredita el beneficio; no mezclar cuentas ni beneficios entre negocios. | 2 |
| RF-13 | Seguir el estado del pedido sin registro. | El comensal ve solo sus pedidos y recupera el estado al reconectar. | 1 |
| RF-14 | Anular un pedido con devolución de stock. | Solo roles autorizados; stock y pedido cambian en una transacción; se conservan motivo y autor. | 1 |

La iteración 1 cubre el recorrido de carta, pedido, cocina y caja. Son criterios de la solución; el ejemplo académico implementa solo una parte. La aceptación integral necesita al menos dos negocios, distintos permisos, concurrencia y reconexión.
