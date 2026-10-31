# Escenarios de atributos de calidad

Criterios de aceptación; no resultados de una aceptación integral ejecutada.

| Escenario | Fuente | Estímulo | Artefacto | Entorno | Respuesta | Medida propuesta |
|---|---|---|---|---|---|---|
| EQ01 / AC01 | Usuario del negocio A | Solicita un recurso de B | API, datos y eventos | Dos empresas y roles distintos | Rechaza acceso sin cambios | 0 accesos cruzados; 100 % de tablas de negocio con RLS forzado. |
| EQ02 / AC02 | Sesión revocada | Repite una operación protegida | Autorización REST y eventos | Sesión revocada y permisos retirados | Rechaza la operación | 100 % de la [matriz](01-actores.md#permisos-por-actor) correcta; 0 operaciones aceptadas tras revocar. |
| EQ03 / AC03 | Comensal | Reenvía misma clave/contenido | Pedido e inventario | Respuesta perdida tras confirmar | Devuelve pedido anterior | 0 duplicados en 1 000 reintentos; 0 stock negativo; 0 cambios parciales. |
| EQ04 / AC04 | Comensales y personal | Generan la carga pico | Web, API y PostgreSQL | Perfil de carga con 0,5 CPU y 512 MB | Conserva integridad y responde | p95: carta ≤ 500 ms, confirmar ≤ 1 s, llegada a cocina ≤ 2 s, reporte ≤ 3 s; errores < 1 %; LCP móvil ≤ 2,5 s. |
| EQ05 / AC05 | Equipo | Sustituye un adaptador | Contratos y casos de uso | Misma responsabilidad y contrato | Conserva reglas de negocio | 0 dependencias prohibidas; 0 archivos del núcleo tocados; ningún archivo de más de 300 líneas; 0 rutas con acceso a la base. |
| EQ06 / AC06 | Equipo de despliegue | Prueba frontend en runtime objetivo | Web, SSR, sesión e imágenes | Entorno de preproducción | Preserva recorrido y reversión | 100 % de casos de subdominio, sesión, identidad, imágenes y eventos aprobados. |
| EQ07 / AC07 | API / red | Se interrumpe y reconecta | API y clientes operativos | Una instancia, pedidos persistidos | Recupera el estado por REST | ≥ 99,5 % mensual; recuperación ≤ 5 min; pedidos y cobros iguales a la base. |
| EQ08 / AC08 | Operación | Restaura una copia válida | DB de recuperación y archivos | Entorno separado sin tráfico comercial | Recrea datos, roles, RLS y referencias | RPO ≤ 24 h; RTO ≤ 2 h; 100 % de verificaciones. |
| EQ09 / AC09 | Falla controlada | Provoca error y respaldo fallido | Logs, monitoreo y alertas | Entorno de ensayo | Relaciona incidente sin secretos | 100 % de errores rastreables por requestId; 0 secretos en logs; alerta ≤ 5 min. |
| EQ10 / AC10 | Release | Falla una comprobación o un cambio de esquema | CI/CD y esquema | Credenciales separadas | Bloquea release fallido y conserva controles | 0 publicaciones con una comprobación fallida; 0 políticas RLS perdidas. |
| EQ11 / AC04 | Más negocios | Aumenta la carga por escalones | API y PostgreSQL | Mismos datos con 0,5 CPU y 512 MB; luego más recursos | Mantiene los límites de EQ04 | 2 veces el pico; memoria < 512 MB; se reporta la ganancia al subir recursos. |
| EQ12 / AC07 | Red / socket | Se pierde un aviso de pedido | Eventos y pantalla de cocina | Pedido confirmado y pantalla conectada | Relee la comanda por REST | Comanda visible en ≤ 30 s. |
| EQ13 / AC11 | Comensal sin ayuda | Busca un plato y confirma | Carta QR en móvil | Cinco personas con la misma tarea | Completa el pedido | ≥ 90 % sin ayuda; mediana ≤ 2 min; SUS ≥ 68; accesibilidad ≥ 90 en Lighthouse. |

## Cómo se mide

| Escenario | Verificación | Estado |
|---|---|---|
| EQ01 | Pruebas con dos negocios y rol restringido; consulta al catálogo de PostgreSQL. | Por validar |
| EQ02 | Pruebas por rol y operación. | Por validar |
| EQ03 | Reintentos concurrentes y comprobaciones SQL. | Medido en memoria |
| EQ04 | k6 con un umbral por operación; Lighthouse móvil. | Por validar |
| EQ05 | Prueba de dependencias, `git diff --stat` y conteo de líneas. | Medido en el demo |
| EQ06 | Mismas pruebas en el entorno objetivo antes de publicar. | Por validar |
| EQ07 | Monitor externo cada 5 min; simulacro de caída. | Por validar |
| EQ08 | Simulacro de restauración cronometrado. | Por validar |
| EQ09 | Fallas provocadas y revisión de logs. | Por validar |
| EQ10 | CI y comparación del esquema antes y después. | Por validar |
| EQ11 | k6 por escalones hasta romper los límites de EQ04. | Por validar |
| EQ12 | Bloquear el evento y cronometrar la relectura. | Por validar |
| EQ13 | Tarea observada y Lighthouse; cinco personas hallan problemas, no dan una estadística. | Por validar |

## Perfil de carga

Supuesto: 20 negocios de 15 mesas al 80 %, 2 teléfonos por mesa, 2 pedidos por mesa cada hora, la mitad de comensales siguiendo su pedido y relectura de respaldo cada 25 s. Pico estimado: carta 16/s, seguimiento 10/s, cocina y caja 2/s, 8 pedidos/min y 24 cambios de estado/min; unas 30 peticiones/s. El ensayo usa el doble.

## Mediciones registradas

Demo Angular en memoria, Node 22, base `714655f`, 31/10/2026. No mide PostgreSQL, Socket.IO ni carga.

| Escenario | Medición | Resultado |
|---|---|---|
| Demo | `npm test` y `npm run build` | 21 de 21 pruebas; build aprobado. |
| EQ03 | 1 000 reintentos concurrentes con la misma clave | 1 pedido y 1 reserva. |
| EQ03 | Última unidad y línea sin stock | 0 stock negativo; 0 cambios parciales. |
| EQ05 | Imports del núcleo | 0 externos; 6 de 6 imports prohibidos detectados. |
| EQ05 | Cambiar `NotificadorConsola` por `NotificadorTiempoReal` | 1 archivo (`app.config.ts`); 0 del núcleo; build aprobado. |
| EQ05 | Archivo más grande | 207 líneas; el demo no tiene rutas. |
