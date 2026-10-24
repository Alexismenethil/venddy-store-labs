# Escenarios de atributos de calidad

Criterios de aceptación; no resultados de una aceptación integral ejecutada.

| Escenario | Fuente | Estímulo | Artefacto | Entorno | Respuesta | Medida |
|---|---|---|---|---|---|---|
| EQ01 / AC01 | Usuario del negocio A | Solicita un recurso de B | API, datos y eventos | Dos empresas y roles distintos | Rechaza acceso sin cambios | Ningún caso definido entrega o modifica datos de B. |
| EQ02 / AC02 | Sesión revocada | Repite una operación protegida | Autorización REST y eventos | Sesión revocada y permisos retirados | Rechaza la operación | Ninguna operación de la matriz persiste cambios no autorizados. |
| EQ03 / AC03 | Comensal | Reenvía misma clave/contenido | Pedido e inventario | Respuesta perdida tras confirmar | Devuelve pedido anterior | Una identidad y una reserva; otro contenido se rechaza. |
| EQ04 / AC04 | Usuarios concurrentes | Aumentan solicitudes representativas | Web, API y PostgreSQL | Datos, carga y duración documentados | Conserva integridad y responde | Medir p95/errores/memoria/conexiones; límites por acordar. |
| EQ05 / AC05 | Equipo | Sustituye un adaptador | Contratos y casos de uso | Misma responsabilidad y contrato | Conserva reglas de negocio | Pruebas del núcleo aprobadas y cero imports externos en el núcleo. |
| EQ06 / AC06 | Equipo de despliegue | Prueba frontend en runtime objetivo | Web, SSR, sesión e imágenes | Entorno de preproducción | Preserva recorrido y reversión | Casos de subdominio, sesión, identidad e imágenes aprobados. |
| EQ07 / AC07 | API / red | Se interrumpe y reconecta | API y clientes operativos | Una instancia, pedidos persistidos | Recupera el estado por REST | Pedidos/cobros coinciden con la base; registrar tiempo de caída. |
| EQ08 / AC08 | Operación | Restaura una copia válida | DB de recuperación y archivos | Entorno separado sin tráfico comercial | Recrea datos, roles, RLS y referencias | Medir RPO/RTO; metas externas 24 h / 2 h por ensayar. |
| EQ09 / AC09 | Falla controlada | Provoca error y respaldo fallido | Logs, monitoreo y alertas | Entorno de ensayo | Relaciona incidente sin secretos | Error y alerta verificables por requestId; sin tokens/cookies expuestos. |
| EQ10 / AC10 | Release | Falla una comprobación o migración | CI/CD y esquema | Credenciales separadas | Bloquea release fallido y conserva controles | Fallo no publica; esquema/roles/RLS y operación se verifican. |
