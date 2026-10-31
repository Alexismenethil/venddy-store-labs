# Atributos de calidad

| ID | Atributo | Métrica y meta propuesta | Estado |
|---|---|---|---|
| AC01 | Seguridad y aislamiento | 0 accesos cruzados; 100 % de tablas de negocio con RLS forzado. | Por validar; núcleo en memoria probado. |
| AC02 | Autenticación y autorización | 100 % de la [matriz de permisos](01-actores.md#permisos-por-actor) correcta; 0 operaciones aceptadas tras revocar. | Por validar. |
| AC03 | Integridad transaccional | 0 duplicados en 1 000 reintentos; 0 stock negativo; 0 cambios parciales. | Medido en memoria; PostgreSQL por validar. |
| AC04 | Rendimiento, capacidad y escalabilidad | p95: carta ≤ 500 ms, confirmar ≤ 1 s, llegada a cocina ≤ 2 s, reporte ≤ 3 s; errores < 1 %; LCP móvil ≤ 2,5 s; 2 veces el pico con 0,5 CPU y 512 MB. | Por validar. |
| AC05 | Mantenibilidad | 0 dependencias prohibidas; 0 archivos del núcleo tocados al cambiar un adaptador; ningún archivo de más de 300 líneas; 0 rutas con acceso a la base. | Medido en el demo; backend por validar. |
| AC06 | Portabilidad | 100 % de casos aprobados en el entorno objetivo: subdominio, sesión, identidad, imágenes y eventos. | Por validar. |
| AC07 | Disponibilidad | ≥ 99,5 % mensual; recuperación ≤ 5 min; aviso perdido ≤ 30 s. | Por validar; una API no ofrece continuidad ante su caída. |
| AC08 | Recuperabilidad | RPO ≤ 24 h; RTO ≤ 2 h; 100 % de verificaciones de roles, RLS, pedidos y fotos. | Por validar. |
| AC09 | Observabilidad | 100 % de errores rastreables por requestId; 0 secretos en logs; alerta ≤ 5 min. | Por validar. |
| AC10 | Entrega verificable | 0 publicaciones con una comprobación fallida; 0 políticas RLS perdidas. | Por validar. |
| AC11 | Usabilidad y accesibilidad | ≥ 90 % pide sin ayuda; mediana ≤ 2 min; SUS ≥ 68; accesibilidad ≥ 90 en Lighthouse. | Por validar. |

[Escenarios y medición](08-escenarios-atributos-calidad.md). Ninguna meta equivale a un resultado: lo medido se registra en los escenarios.
