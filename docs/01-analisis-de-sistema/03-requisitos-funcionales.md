# Requisitos funcionales

| ID | Requisito de Venddy | Criterio de aceptación |
|---|---|---|
| RF-01 | Identificar el negocio por un subdominio registrado. | Cada negocio muestra su carta; un subdominio inexistente se rechaza. |
| RF-02 | Administrar catálogo, variantes, precios y disponibilidad con permisos. | El cambio autorizado afecta solo al negocio correspondiente. |
| RF-03 | Consultar carta y formar pedido desde navegador sin registro obligatorio. | El enlace conserva negocio y mesa cuando corresponda. |
| RF-04 | Recalcular precios, promociones y stock en el servidor. | Alterar el total del navegador no altera el confirmado; un rechazo no reserva parcialmente. |
| RF-05 | Reconocer una clave de idempotencia acotada al negocio. | Misma clave y contenido: un pedido y una reserva; contenido distinto: rechazo. |
| RF-06 | Distribuir comandas por estación y actualizar estados. | Solo las estaciones autorizadas del negocio reciben el pedido. |
| RF-07 | Gestionar turno, edición autorizada, cobros, arqueo y cierre. | Validar importes, medios de pago y permisos; conservar movimientos y diferencias. |
| RF-08 | Generar una nota de venta interna asociada al cobro. | El documento conserva importes y se identifica como nota interna, sin validación SUNAT. |
| RF-09 | Registrar ajustes y descuentos de inventario con trazabilidad. | No aceptar stock negativo ni ajustes sin permiso; conservar autoría y negocio. |
| RF-10 | Consultar y exportar reportes autorizados por intervalo. | Rango, negocio e importes coinciden con las operaciones persistidas. |
| RF-11 | Administrar negocios, planes, estado y visitas de soporte. | Slug único y acceso transversal reservado a plataforma/soporte autorizado. |
| RF-12 | Ofrecer fidelidad opcional con reglas por empresa. | Un cobro elegible acredita el beneficio; no mezclar cuentas ni beneficios entre negocios. |

Los requisitos conservan los identificadores del informe de Venddy. Son criterios de la solución; el ejemplo académico implementa solo una parte. La aceptación integral necesita al menos dos negocios, distintos permisos, concurrencia y reconexión.
