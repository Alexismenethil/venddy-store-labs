# C3: componentes de la API

![C3: componentes de la API](../../img/nivel3-componentes.png)

**Alcance:** Entrada REST, eventos y ocho módulos en el mismo backend. No son ocho microservicios.

| Componente | Responsabilidad |
|---|---|
| API REST | Rutas `/api/v1`: negocio por subdominio, sesión, permisos, validación, límites y errores. |
| Eventos Socket.IO | Conexión autorizada; salas por negocio y estación; avisos después de confirmar. |
| Ocho módulos | [Responsabilidades y requisitos](../02-arquitectura-software/componentes-arquitectonicos.md). |

| Origen | Destino | Para qué | Comunicación |
|---|---|---|---|
| Aplicación web | API REST | Consultar y operar | HTTPS/JSON |
| Eventos | Aplicación web | Avisar cambios | WSS |
| API REST | Módulos | Invocar casos de uso | En memoria |
| Pedidos | Catálogo | Leer precio y disponibilidad | Contrato público |
| Pedidos | Inventario | Reservar y devolver stock | Contrato público, misma transacción |
| Pedidos | Eventos | Avisar a cocina tras confirmar | En memoria |
| Caja | Pedidos | Cerrar el pedido cobrado | Contrato público, misma transacción |
| Caja | Fidelidad | Acreditar beneficios | Contrato público, misma transacción |
| Reportes | Caja | Consultar ventas | Contrato de lectura |
| Administración | Catálogo | Configurar la carta | Contrato público |
| Plataforma | Administración | Preparar y suspender negocios | Contrato público |
| Módulos | PostgreSQL | Leer y escribir sus tablas | SQL con Prisma |
| Catálogo | Fotos y archivos | Guardar y publicar fotos | HTTPS |
| Fidelidad | Google Identity | Identificar al cliente | HTTPS |

| # | Regla del monolito modular |
|---|---|
| 1 | Todos los componentes se despliegan juntos en una API. |
| 2 | Un módulo usa a otro solo por su API pública (`index.ts`). |
| 3 | Un módulo no lee ni escribe las tablas de otro. |
| 4 | Una operación entre módulos se confirma con una unidad de trabajo (ADR-007). |
| 5 | Cada módulo se organiza por dentro con Clean Architecture. |

[SVG](../../img/fuentes-svg/nivel3-componentes.svg).

Modelo: [C4 oficial](https://c4model.com/diagrams). Las vistas comunican la misma propuesta Clean Architecture a distintos niveles de detalle.
