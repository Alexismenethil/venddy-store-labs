# Restricciones de Venddy

| ID | Restricción | Aplicación |
|---|---|---|
| RC01 | Web e internet | Carta por navegador sin instalación; operación conectada. |
| RC02 | Stack elegido | Next.js/React, Express/Socket.IO y Prisma/PostgreSQL. Angular es solo la demostración de este repositorio. |
| RC03 | REST y eventos | REST consulta y recupera estado; eventos posteriores a confirmar la operación. |
| RC04 | Ámbito empresarial | Subdominio registrado, contexto por petición, permisos, RLS, salas y claves por negocio. |
| RC05 | Una API objetivo | Una instancia de backend; capacidad y memoria se ensayan antes de admitir carga. Sin alta disponibilidad implícita. |
| RC06 | Frontend objetivo | Workers/OpenNext se valida antes de publicar `venddy.store`; conservar ruta de reversión. |
| RC07 | Fuente de verdad | PostgreSQL principal conserva transacciones de pedidos, cobros y stock; caché no autoritativa. |
| RC08 | Archivos y respaldos | Fotos en almacenamiento de objetos; respaldo privado y credenciales separados del acceso público. |
| RC09 | Capacidad y presupuesto | Planes, cuotas y consumo deben comprobarse antes de contratar. No se presenta un precio mensual fijo ni capacidad no medida. |
| RC10 | Control y release | Git y comprobaciones automáticas; cambios de esquema con credenciales separadas del rol de operación. |
| RC11 | SQL y roles | Preservar funciones, políticas y restricciones SQL que el ORM no representa; respaldar también los roles necesarios. |
| RC12 | Cobros y notas internas | Registrar medios de pago recibidos. Sin pasarela, envíos, facturación electrónica SUNAT ni operación sin conexión. |
| RC13 | Recuperación separada | Base de restauración bajo demanda, sin tráfico comercial ni failover; RPO/RTO son metas por ensayar. |
| RC14 | Organización seleccionada | Monolito modular y Clean Architecture; cuatro responsabilidades con dependencias hacia el núcleo. |

Proveedores previstos: Render, Neon, Cloudflare Workers y R2; no se presentan como contratados. [Detalle de datos y archivos](../02-arquitectura-software/arquitectura-inicial.md#datos-y-recuperación).
