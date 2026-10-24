# Drivers arquitectónicos

| ID | Condición de Venddy | Origen | Consecuencia |
|---|---|---|---|
| DA01 | Evitar cruces entre negocios | RF-01, 06, 10–12; AC01–02 | Contexto, permisos, RLS y salas; ADR-005. |
| DA02 | Conservar pedidos, cobros y stock | RF-04–05, 07–09, 12; AC03 | Transacciones, céntimos e idempotencia; ADR-004. |
| DA03 | Coordinar cocina, caja y seguimiento | RF-03, 06–07; AC02, AC07 | Eventos confirmados y recuperación por REST; ADR-006. |
| DA04 | Cambiar reglas y proveedores | AC05; RC02, RC14 | Monolito modular y Clean Architecture; ADR-001/002. |
| DA05 | Conservar el flujo al cambiar frontend | AC06; RC06 | Ensayar runtime, SSR, sesiones y subdominios antes de migrar. |
| DA06 | Admitir carga con evidencia | AC04, AC07; RC05, RC09 | Consultas/pool/caché acotados; medir antes de escalar. ADR-003. |
| DA07 | Distribuir fotografías sin exponer copias | AC04, AC08; RC08 | Separar medios públicos, CDN y respaldo privado. |
| DA08 | Recuperar datos y archivos comprobados | AC08; RC13 | Copias y restauración en base separada; metas RPO/RTO. |
| DA09 | Diagnosticar sin exponer secretos | AC09 | Logs/requestId, errores y alertas verificadas. |
| DA10 | Publicar conservando seguridad | AC10; RC10–11 | Verificar, migrar y comprobar con roles separados. |

DA04 es mantenibilidad; DA06 es capacidad medida. [Decisiones](07-decisiones-arquitectonicas.md).
