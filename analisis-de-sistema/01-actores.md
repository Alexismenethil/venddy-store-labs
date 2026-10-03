# Actores

Venddy es una plataforma web multiempresa para negocios de comida. Cada actor opera dentro del negocio y los permisos que le corresponden; el acceso de plataforma se mantiene separado del acceso del personal.

## Actores humanos

| Actor | ¿Qué necesita realizar? |
| :--- | :--- |
| Comensal | Abrir la carta de un negocio por QR, consultar productos y disponibilidad, formar un pedido y seguir su preparación sin instalar una aplicación ni registrarse obligatoriamente. |
| Personal de preparación | Consultar las comandas de sus estaciones, actualizar los estados de preparación y comunicar los cambios a caja y al comensal. |
| Cajero | Abrir y gestionar su turno, editar pedidos con autorización, registrar cobros y medios de pago, emitir notas de venta internas, realizar arqueo y cerrar caja. |
| Administrador del negocio | Mantener catálogo, precios, disponibilidad, presentación, personal, permisos, mesas, estaciones, inventario y reportes de su negocio. |
| Operador de la plataforma | Dar de alta negocios, reservar sus subdominios, administrar planes y estado del servicio y gestionar la cartera de Venddy. |
| Personal de soporte autorizado | Acceder al negocio indicado dentro de una visita de soporte autorizada, con alcance explícito y trazabilidad; no utilizar el acceso del negocio como privilegio general de plataforma. |
| Cliente de fidelidad | Identificarse cuando el negocio habilite el programa, consultar sus beneficios y acumular los beneficios asociados a cobros elegibles. |

Una persona puede desempeñar varios roles si recibe los permisos correspondientes. El cliente de fidelidad es una participación opcional del comensal; no se exige esa identificación para consultar la carta o realizar un pedido ordinario.

## Servicios externos y proveedores

| Servicio o proveedor | Responsabilidad | Situación en la arquitectura |
| :--- | :--- | :--- |
| Google Identity | Identificar al cliente cuando se utiliza el acceso con Google para fidelidad. | Integración prevista por el sistema; su configuración debe comprobarse en cada despliegue. |
| Vercel | Ejecutar el frontend Next.js y distribuir sus recursos estáticos. | Despliegue actual documentado; será sustituido por Workers en el objetivo. |
| Cloudflare Workers | Ejecutar el frontend Next.js mediante OpenNext y servir sus recursos estáticos. | Objetivo de lanzamiento, pendiente de implementación y validación. |
| Render | Ejecutar la API Express y Socket.IO; ejecutar por separado las tareas programadas de respaldo. | La API está publicada en Free; el objetivo utiliza Starter y un job de Cron. |
| Neon | Alojar PostgreSQL para las operaciones, las políticas de aislamiento y la recuperación configurada. | Base actual documentada; el objetivo utiliza Launch y recuperación bajo demanda en un proyecto separado. |
| Cloudinary | Almacenar y distribuir las fotografías de los negocios. | Proveedor actual documentado; será sustituido por R2 en el objetivo. |
| Cloudflare R2 y CDN | Guardar fotografías para entrega por un dominio público y mantener los respaldos en un bucket privado separado. | Objetivo de lanzamiento; los medios públicos y los archivos de recuperación requieren permisos distintos. |

Los proveedores de infraestructura no son usuarios del negocio ni tienen historias de usuario propias. Sentry, UptimeRobot y GitHub Actions apoyan la supervisión y entrega del sistema; se describen en los atributos de calidad y las decisiones arquitectónicas.

El alcance no incorpora una pasarela de pago en línea, un servicio de envío, un ERP externo ni emisión electrónica ante SUNAT. Registrar el medio de un cobro y emitir una nota de venta interna no equivale a esas integraciones.
