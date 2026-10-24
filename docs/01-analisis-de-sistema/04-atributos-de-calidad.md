# Revisiones de atributos de calidad

| ID | Atributo | Revisión | Evidencia exigida | Estado y límite |
|---|---|---|---|---|
| AC01 | Seguridad y aislamiento | Intentar leer, escribir o recibir datos de otro negocio. | Sin accesos cruzados; validar contexto, permisos, RLS y salas. | Pruebas integrales pendientes; núcleo en memoria verificable. |
| AC02 | Autenticación y autorización | Revocar sesión o permiso y repetir una operación REST/evento. | Rechazo sin cambios; HTTPS y cookies protegidas. | Control descrito en informe; aceptación de entorno pendiente. |
| AC03 | Integridad transaccional | Repetir pedidos, competir por stock y provocar fallos. | Una identidad/reserva; sin stock negativo ni cambios parciales. | Reglas demostrables en memoria; PostgreSQL requiere ensayo integral. |
| AC04 | Rendimiento y capacidad | Ejecutar carga representativa de carta, pedidos, caja y reportes. | Registrar p95, errores, memoria y conexiones; sin divergencias ni reinicios. | Umbrales y capacidad por acordar/medir; sin número comercial garantizado. |
| AC05 | Mantenibilidad | Cambiar un adaptador y revisar dependencias. | Dominio/Aplicación sin frameworks; pruebas del núcleo aprobadas. | Demostración académica; no acredita migración productiva. |
| AC06 | Portabilidad | Ensayar frontend, sesiones y subdominios en el runtime objetivo. | Conservar SSR, identidad, cookies, imágenes y conexión de eventos. | Migración a Workers/OpenNext pendiente de validar. |
| AC07 | Disponibilidad | Interrumpir y reiniciar la API; reconectar clientes. | Detectar caída y recuperar estado persistido; medir indisponibilidad. | Una API no ofrece continuidad ante su caída; sin réplica activa. |
| AC08 | Recuperabilidad | Restaurar una copia de datos y archivos en entorno separado. | Verificar roles, RLS, pedidos y referencias a fotos; medir RPO/RTO. | Metas externas RPO 24 h y RTO 2 h, pendientes de ensayo. |
| AC09 | Observabilidad | Provocar error, indisponibilidad y respaldo fallido. | Relacionar requestId/log/alerta sin filtrar tokens ni secretos. | Integración y alertas por verificar en el entorno objetivo. |
| AC10 | Entrega verificable | Forzar fallo de comprobaciones y aplicar migración de prueba. | Bloquear publicación fallida y preservar roles, RLS y restricciones. | Compuerta de release y reversión por validar. |

[Escenarios de seis partes](08-escenarios-atributos-calidad.md). Ningún objetivo equivale a una garantía de producción ni a un resultado de carga no ejecutado.
