# Estilo arquitectónico de Venddy Store

## 1. Estilo seleccionado

Se selecciona un **monolito modular para el backend**, comunicado con el cliente web mediante REST y Socket.IO. La vista global se organiza en tres capas: Presentación, Aplicación y negocio, y Persistencia e integraciones.

El backend es una única unidad de despliegue. Sus módulos colaboran dentro de la misma aplicación mediante servicios y contratos; cada módulo protege sus repositorios. El cliente web y los recursos externos se representan fuera del proceso de la API.

Esta selección corresponde a **ADR-001**. **Clean Architecture**, definida en ADR-002, organiza las dependencias internas en Dominio, Aplicación, Presentación e Infraestructura; sus cuatro carpetas se detallan en el paso 5.

## 2. Justificación y límites

| Driver | Respuesta de la propuesta |
| :--- | :--- |
| DA01 – Aislamiento entre negocios | Contexto empresarial y permisos en las entradas, repositorios dentro del mismo ámbito y RLS en PostgreSQL. |
| DA02 – Integridad de pedidos, cobros y stock | Precios recalculados en servidor, importes en céntimos, transacciones e idempotencia por empresa. |
| DA03 – Coordinación de cocina y caja | Eventos Socket.IO después de confirmar operaciones y recuperación del estado persistido mediante REST. |
| DA04 – Mantenibilidad | Límites modulares y Clean Architecture; los casos de uso dependen de entidades y contratos del núcleo. |
| DA05 – Continuidad del frontend | Mantener Next.js/React y validar el objetivo Workers/OpenNext antes de cambiar el despliegue. |
| DA06 – Capacidad medida | Una API, consultas paginadas, caché de carta acotada y límites de conexiones; crecimiento decidido mediante ensayos. |

El monolito modular conserva una operación sencilla para el alcance del proyecto. Los microservicios añadirían transacciones distribuidas y coordinación de varios servicios sin una necesidad demostrada de despliegue independiente.

Los módulos se despliegan y escalan juntos. La instancia única de API puede interrumpir el servicio si falla; la modularidad no garantiza capacidad ni alta disponibilidad. DA07–DA10 mantienen los objetivos de medios, recuperación, supervisión y entrega documentados en el antecedente de la Guía 02.

## 3. Diagrama arquitectónico

El gráfico sigue la composición del ejemplo del marketplace: actores, cliente web, límite del monolito, **cinco columnas**, organización en tres capas, PostgreSQL, servicios externos y reglas. Los nombres y tecnologías se adaptan a Venddy.

![Monolito modular de Venddy Store](./diagrama-estilo-arquitectonico.png)

[SVG editable](./diagrama-estilo-arquitectonico.svg) · [PNG](./diagrama-estilo-arquitectonico.png) · [PDF](./diagrama-estilo-arquitectonico.pdf)

Las flechas de comunicación indican llamadas durante la ejecución y colaboración entre módulos. Las dependencias de código hacia el núcleo se representan en el [diagrama del enfoque](./enfoque/enfoque-arquitectonico.md).

## 4. Componentes y responsabilidades

Las cinco columnas agrupan los ocho módulos funcionales del análisis; la agrupación permite conservar la estructura del ejemplo sin eliminar responsabilidades de Venddy.

| Columna del gráfico | Módulos y responsabilidades |
| :--- | :--- |
| Identidad y gestión | **Administración:** personal, permisos y configuración del negocio. **Plataforma SaaS:** alta de negocios, planes, estado del servicio y soporte autorizado. |
| Carta y catálogo | **Catálogo y carta:** productos, categorías, variantes, precios, disponibilidad y consulta por QR. |
| Pedidos y cocina | **Pedidos y cocina:** validar y confirmar pedidos, distribuir comandas y gestionar preparación. El carrito es el estado del comensal antes de confirmar su pedido. |
| Caja y ventas | **Caja y ventas:** turnos, cobros, arqueo, cierre y notas internas. **Reportes** consulta operaciones autorizadas y **Fidelidad** registra beneficios elegibles; se agrupan como colaboradores de esta área. |
| Inventario | **Inventario:** movimientos y ajustes autorizados, reserva o descuento de existencias y trazabilidad. |

| Componente | Responsabilidad |
| :--- | :--- |
| Cliente web Next.js/React | Interfaz del comensal, preparación, caja, administradores y plataforma; consume la API. |
| Presentación del backend | Express y Socket.IO reciben solicitudes o eventos, verifican empresa y permisos y delegan a casos de uso. |
| Aplicación y negocio | Coordina las operaciones de los módulos y aplica las reglas del dominio mediante contratos. |
| Persistencia | Prisma implementa repositorios y transacciones sobre PostgreSQL; cada módulo accede a sus datos a través de sus contratos. |
| Imágenes y archivos | Almacenamiento externo: R2 es el objetivo documentado; Cloudinary figura como proveedor actual en el antecedente. |
| Google Identity | Identificación opcional del cliente de fidelidad cuando se habilita ese acceso. |

Las tecnologías corresponden al stack de Venddy; Angular se emplea únicamente en el boilerplate educativo de la Guía 03. El gráfico es una propuesta, no evidencia de una nueva versión desplegada.

## 5. Reglas de organización

1. El navegador consume la API y no accede directamente a PostgreSQL.
2. La entrada valida el contexto de empresa y permisos antes de delegar una operación protegida.
3. Los módulos colaboran por servicios y contratos; no acceden al repositorio interno de otro módulo.
4. El servidor determina precios y disponibilidad. Pedidos, cobros y stock deben confirmarse mediante las transacciones y restricciones correspondientes.
5. Los eventos se publican después de la confirmación; al reconectar, el cliente recupera el estado por REST.
6. Persistencia, archivos e identidad externa se conectan mediante adaptadores, sin introducir sus SDK en las reglas del dominio.

Ejemplo del recorrido: el comensal abre la carta por QR y confirma un pedido; Pedidos coordina la validación del catálogo y el inventario, conserva el pedido y publica la comanda confirmada. Cocina actualiza la preparación; caja registra posteriormente el cobro y el cierre. Registrar un pedido no equivale a cobrarlo mediante una pasarela externa.

## 6. Alcance y siguiente paso

El análisis conserva los doce requisitos de Venddy, incluidos administración, plataforma, inventario, fidelidad y reportes. El diagrama global resume sus relaciones; el boilerplate demuestra solo consulta de carta, carrito y registro de pedido con datos en memoria.

La [arquitectura inicial](./arquitectura-inicial.md), sus HTML y Archify se conservan como antecedente de la Guía 02. Las [decisiones](../analisis-de-sistema/07-%20decisiones-arquitect%C3%B3nicas.md) documentan la selección actual y el [paso 5](./enfoque/enfoque-arquitectonico.md) explica Clean Architecture.
