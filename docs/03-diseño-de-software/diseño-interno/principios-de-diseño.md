# SOLID en el diseño de Venddy

| Principio | Ejemplo concreto | Qué revisar |
|---|---|---|
| S: responsabilidad única | `Pedido` valida estados; el caso de uso coordina; el repositorio conserva; el notificador avisa. | Un cambio de canal no debe cambiar las reglas de estados. |
| O: abierto/cerrado | Añadir otro adaptador que cumpla `NotificadorPedido`. | Mantener el contrato y las reglas existentes. |
| L: sustitución | Un repositorio alternativo respeta idempotencia, empresa e integridad del contrato. | Compartir comportamiento esperado; una firma igual no basta. |
| I: interfaces específicas | Consultar productos, registrar pedidos, registrar cobros y avisar usan contratos separados. | Evitar exigir al notificador métodos de caja o inventario. |
| D: inversión de dependencias | `RegistrarPedidoCasoUso` recibe contratos del dominio. | El núcleo no importa Angular, Express, Prisma ni adaptadores concretos. |

Los adaptadores remotos deben implementar garantías equivalentes en el servidor. Sustituir una clase por HTTP no demuestra automáticamente transacciones, autorización o concurrencia distribuidas.
