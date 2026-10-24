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

El pedido pasa por recibido, en preparación, listo y entregado; solo se cancela desde recibido. La liberación de stock por cancelación requiere su coordinación de aplicación y no está implementada en la demostración.

[Patrones](patrones-de-diseño.md) · [SOLID](principios-de-diseño.md) · [C4](../../04-modelo-c4/Nivel4-DiagramadeCodigo.md).
