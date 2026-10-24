# Venddy Store

Plataforma multiempresa para negocios de comida: carta QR, pedidos, cocina, caja e inventario.

| Proyecto | Decisión |
|---|---|
| Estudiante | Alexis Huamani Rivera · 27220106 |
| Curso | IS-488 Arquitectura de Software · 2026-II |
| Docente de laboratorio | Ing. Lizbeth Jaico Quispe |
| Estilo | **Monolito modular**: una API, ocho módulos de negocio. |
| Enfoque único | **Clean Architecture**: Presentación, Aplicación, Dominio e Infraestructura. |
| Stack del sistema | Next.js/React, Express/Socket.IO, Prisma/PostgreSQL. |
| Alcance de este repositorio | Análisis, arquitectura, diseño, C4 y demostración académica. |

![Clean Architecture original de Venddy](arquitectura/enfoque/diagrama-enfoque-arquitectonico.png)

| Carpeta | Contenido |
|---|---|
| [docs/01-analisis-de-sistema](docs/01-analisis-de-sistema) | Actores, 12 HU/RF, calidad, restricciones, 10 drivers, 6 ADR y escenarios. |
| [docs/02-arquitectura-software](docs/02-arquitectura-software) | Arquitectura general, estilo, enfoque, componentes, almacenamiento y fallos. |
| [docs/03-diseño-de-software](docs/03-diseño-de-software) | Diseño de Pedidos, patrones y principios SOLID aplicados. |
| [docs/04-modelo-c4](docs/04-modelo-c4) | Contexto, contenedores, componentes, clases y secuencia. |
| [docs/05-sustentacion](docs/05-sustentacion) | Respuestas de defensa y recorrido de carpetas y archivos. |
| [arquitectura](arquitectura) | Diagramas originales de estilo y Clean Architecture, con sus PNG, SVG y PDF. |
| [img](img) | Vistas C4 y diagramas complementarios, con sus fuentes SVG. |
| [tecnologia/boilerplate-clean-arquitecture](tecnologia/boilerplate-clean-arquitecture) | Carta, carrito y pedidos académicos en memoria. |

**Datos:** PostgreSQL conserva pedidos, cobros y stock. Las fotos usan almacenamiento de objetos. Una base separada de recuperación es un objetivo de restauración, sin tráfico comercial ni conmutación automática. [Detalle](docs/02-arquitectura-software/almacenamiento-y-recuperacion.md).

**Alcance:** registrar un pedido no cobra. Caja registra pagos recibidos y notas internas. Operación sin internet, pasarela en línea, envíos y emisión electrónica SUNAT quedan fuera. El ejemplo Angular no sustituye el sistema productivo ni demuestra su aceptación integral.

La selección Clean Architecture es la única propuesta activa. Las versiones anteriores se conservan en el historial de Git. El estado de nube del informe del 02/10/2026 es una referencia fechada; no una nueva verificación de producción. Los objetivos de despliegue y recuperación requieren validación.
