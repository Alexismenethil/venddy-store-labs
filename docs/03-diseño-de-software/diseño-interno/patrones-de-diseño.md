# Patrones aplicados a Venddy

| Patrón | Problema de Venddy | Aplicación y límite |
|---|---|---|
| Repository | Conservar pedidos sin acoplar reglas a una tecnología de datos. | `RepositorioPedidos` y adaptador en memoria; Prisma es el diseño de persistencia del sistema. |
| Adapter | Sustituir entrega de avisos o acceso a productos. | `NotificadorConsola`, `NotificadorTiempoReal`, repositorios en memoria/HTTP. HTTP/tiempo real son ejemplos sin URL configurada. |
| Observer / eventos | Comunicar el pedido confirmado a cocina sin incluir su interfaz en Pedidos. | Patrón propuesto para el backend; los eventos se publican después de confirmar. No se afirma que exista un bus implementado en el ejemplo. |
| Unit of Work | Confirmar datos de varios módulos sin que uno escriba las tablas de otro. | Contrato usado por los casos de uso; Prisma lo implementa con una transacción. Propuesto para el backend (ADR-007). |
| Decorator | Acelerar la carta sin cambiar casos de uso ni repositorio. | Caché en RAM de 20 s que envuelve al repositorio de carta. Propuesto para el backend (ADR-003). |

La inyección de dependencias conecta contratos e implementaciones en `app.config.ts`. Es el mecanismo de composición; la inversión de dependencias es la regla de diseño que lo justifica.

No se declaran Factory, Strategy u otros patrones por tener nombres parecidos: se necesitan colaboraciones y un problema concreto que los justifiquen.
