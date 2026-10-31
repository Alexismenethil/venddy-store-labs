# Actores de Venddy

| Actor | Responsabilidad | Origen |
|---|---|---|
| Comensal | Consultar carta QR, preparar pedido y seguir su atención. | HU01, HU03–HU05, HU13 |
| Preparación | Recibir comandas de sus estaciones y actualizar estados. | HU06 |
| Caja | Gestionar turno, cobros, anulaciones, arqueo, cierre y nota interna. | HU07–HU08, HU14 |
| Administrador del negocio | Configurar catálogo, inventario, permisos y reportes propios. | HU02, HU09–HU10 |
| Operador de plataforma | Gestionar negocios, planes y estado del servicio. | HU11 |
| Soporte autorizado | Acceder al negocio y funciones permitidos durante la visita. | HU11 |
| Cliente de fidelidad | Identificarse opcionalmente y usar beneficios del negocio. | HU12 |

Google Identity es un servicio externo de identificación opcional para fidelidad. La API, PostgreSQL y el almacenamiento pertenecen a la solución técnica, no son actores humanos.

## Permisos por actor

| Operación | Comensal | Preparación | Caja | Administrador | Plataforma | Soporte |
|---|---|---|---|---|---|---|
| Seguir su pedido | Sí | — | — | — | — | — |
| Cambiar preparación | — | Sí | — | Sí | — | Visita |
| Cobrar y anular | — | — | Sí | Sí | — | — |
| Turno y arqueo | — | — | Sí | Sí | — | — |
| Ajustar stock | — | — | — | Sí | — | Visita |
| Configurar catálogo y personal | — | — | — | Sí | — | Visita |
| Consultar reportes | — | — | — | Sí | — | Visita |
| Gestionar negocios y planes | — | — | — | — | Sí | — |

La carta y el pedido por QR son públicos. Visita: solo durante una visita de soporte autorizada.
