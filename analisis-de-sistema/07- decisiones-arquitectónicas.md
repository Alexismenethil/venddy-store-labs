# Decisiones Arquitectónicas

> Guía 03, paso 3. Propuesta académica de Venddy Store. Las decisiones describen cómo organizar el sistema; no acreditan una reorganización ya desplegada en producción.

| ID | Decisión arquitectónica | Driver relacionado | Justificación | Resultado |
| :--- | :--- | :--- | :--- | :--- |
| ADR-001 | Monolito modular con una única unidad de despliegue del backend | DA04 – Mantenibilidad; DA06 – Capacidad medida | Separar responsabilidades del negocio manteniendo la operación de una sola API. El crecimiento se decide después de medir la capacidad. | Módulos de Catálogo y carta, Pedidos y cocina, Caja y ventas, Inventario, Administración, Plataforma SaaS, Fidelidad y Reportes. |
| ADR-002 | Clean Architecture como enfoque de la Guía 03 | DA04 – Mantenibilidad; AC05; RC14 | Organizar las dependencias hacia el núcleo y seguir la estructura trabajada en clase por indicación de la docente. | Dominio, Aplicación, Presentación e Infraestructura; entidades y casos de uso independientes de frameworks. |
| ADR-003 | Caché acotada por negocio para consultas de carta | DA06 – Capacidad; DA01 – Aislamiento; DA02 – Integridad | Reducir lecturas repetitivas sin usar la caché como autoridad para precios, cobros o existencias. | Caché con clave por empresa, TTL objetivo de 20 segundos e invalidación; el servidor recalcula y valida al confirmar el pedido. |
| ADR-004 | Persistencia, transacciones y eventos mediante contratos y adaptadores | DA02 – Integridad; DA03 – Coordinación; DA04 – Mantenibilidad | Aislar Prisma y Socket.IO de las reglas y coordinar la confirmación de las operaciones antes de notificar. | Repositorios y unidad de transacción en Infraestructura; idempotencia por empresa; eventos posteriores a la confirmación. |
| ADR-005 | Autenticación, permisos y aislamiento por empresa | DA01 – Aislamiento; DA03 – Coordinación segura | Proteger cada negocio en HTTP, reportes y tiempo real, diferenciando personal y acceso de plataforma. | Empresa resuelta por subdominio, autorización en el backend, RLS y salas de eventos dentro del ámbito permitido. |
| ADR-006 | Cliente web separado del backend mediante REST y tiempo real | DA03 – Coordinación; DA05 – Continuidad del frontend | Permitir que carta, cocina y caja compartan un estado persistido sin acceso directo del navegador a PostgreSQL. | Next.js/React consume la API Express; Socket.IO comunica cambios y REST permite recuperar el estado al reconectar. |

Los identificadores DA01 a DA10 conservan el significado del análisis de Venddy. **DA04 corresponde a mantenibilidad**, equivalente al propósito educativo del DA06 del marketplace; el DA06 de Venddy sigue referido a capacidad medida. Las decisiones de medios, recuperación, supervisión y entrega asociadas a DA07–DA10 se conservan en la [arquitectura inicial](../arquitectura/arquitectura-inicial.md).

## ADR-001: selección del estilo global

**Estado:** seleccionado para la propuesta académica.

**Contexto:** Venddy coordina la carta por QR, el pedido, las estaciones de preparación, el cobro y el inventario de varios negocios. El análisis exige aislamiento y consistencia, pero mantiene una sola API como objetivo de lanzamiento (RC05).

**Alternativas consideradas:**

- **Monolito sin límites modulares:** permite un despliegue sencillo, pero facilita que una operación dependa directamente de detalles de otras áreas.
- **Monolito modular:** mantiene un despliegue único y separa responsabilidades mediante interfaces y casos de uso.
- **Microservicios:** permiten despliegues independientes, pero introducen comunicación distribuida, coordinación de transacciones y operación de varios servicios. Los drivers actuales no justifican esa complejidad.

**Decisión:** mantener el monolito modular. La vista global conserva tres capas —Presentación, Aplicación y negocio, Persistencia e integraciones—; la organización interna se precisa mediante ADR-002.

**Consecuencias:** los módulos se despliegan juntos, colaboran por sus servicios o contratos y protegen sus repositorios. Una instancia adicional replica el backend completo; antes de incorporarla se deben resolver la coordinación de eventos, las conexiones y el estado compartido. La modularidad por sí sola no garantiza disponibilidad ni capacidad.

## ADR-002: actualización del enfoque académico

**Estado:** seleccionado para la Guía 03; sustituye la selección hexagonal en la propuesta académica vigente.

**Contexto:** la Guía 02 documentó puertos y adaptadores en el backend. La docente solicita continuar con el enfoque y las cuatro carpetas del ejemplo de clase para reconocer las responsabilidades y revisar las dependencias. AC05 y DA04 ya exigen reglas independientes de la tecnología.

**Alternativas consideradas:**

- **Arquitectura hexagonal:** organiza entradas y salidas mediante puertos y adaptadores. Continúa registrada en la documentación inicial como antecedente válido del análisis.
- **Clean Architecture:** organiza entidades y casos de uso en el núcleo y deja la interfaz y los mecanismos técnicos en las capas externas. Facilita comparar el proyecto con el ejemplo de clase.
- **Capas con dependencias directas a la base de datos:** una separación visual de carpetas sin inversión de dependencias permitiría que los casos de uso importen Prisma o componentes de interfaz; no cumple AC05.

**Decisión:** usar **Clean Architecture** con `dominio/`, `aplicacion/`, `presentacion/` e `infraestructura/`, como la referencia del marketplace, adaptando sus responsabilidades a Venddy. La selección responde al objetivo educativo y a DA04; no afirma que Hexagonal sea incorrecta ni que el código productivo haya sido migrado.

| Capa | Responsabilidad en Venddy |
| :--- | :--- |
| Dominio | Reglas de productos, importes, pedidos, stock y estados, junto con los contratos del núcleo usados en el ejemplo. |
| Aplicación | Coordinar consultar carta, agregar productos y registrar un pedido; en el sistema completo, también preparación, cobros y demás casos de uso. |
| Presentación | Pantallas y estado de interfaz; en el backend propuesto, rutas y controladores que traducen las solicitudes. |
| Infraestructura | Repositorios, transacciones, eventos, archivos y adaptadores que implementan los contratos del núcleo. |

**Consecuencias:**

- Dominio y Aplicación no importan Angular, Express, Prisma ni SDK externos. Los adaptadores dependen de los contratos que implementan.
- La raíz de composición conecta los casos de uso con implementaciones concretas. Cambiar un adaptador que cumple el contrato no exige cambiar las reglas del pedido.
- Los contratos y la coordinación de transacciones deben conservar aislamiento por empresa, idempotencia e integridad; separar carpetas no reemplaza esos controles.
- El `boilerplate/` Angular demuestra la estructura en un entorno académico con datos en memoria. No sustituye Next.js, Express ni Prisma, ni implementa todos los requisitos de Venddy.
- Los diagramas, HTML, Archify e historial de la Guía 02 se conservan. Los documentos de estilo y enfoque de la Guía 03 comunican la decisión vigente.

## Relación entre las vistas

El [estilo arquitectónico](../arquitectura/estilo-arquitectonico.md) representa la organización global y las llamadas durante la ejecución. El [enfoque Clean Architecture](../arquitectura/enfoque/enfoque-arquitectonico.md) representa las dependencias del código: ambas vistas describen niveles distintos del mismo monolito modular.

El registro de cobros corresponde a caja y ventas. No incorpora una pasarela en línea, un servicio de envío ni facturación electrónica SUNAT; esos servicios del marketplace de referencia no forman parte del alcance de Venddy (RC12).

## Referencia del laboratorio

Guía 03 de Arquitectura de Software [IS-488], Ing. Lizbeth Jaico Quispe, semestre 2026-II, páginas 4 y 6–9. La estructura de archivos y la tabla de cinco columnas siguen el avance de **Marketplace-arquitSoft-02-ALEXIS**, adaptados al caso de estudio Venddy Store.
