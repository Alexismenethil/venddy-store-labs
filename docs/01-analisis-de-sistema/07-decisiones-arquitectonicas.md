# Decisiones arquitectónicas

**Selección única:** monolito modular como estilo y **Clean Architecture** como enfoque.

| ID | Decisión | Driver | Justificación y efecto |
|---|---|---|---|
| ADR-001 | Monolito modular | DA04, DA06 | Ocho módulos en una API. Operación sencilla; una caída del proceso afecta a esa API. |
| ADR-002 | Clean Architecture | DA04, AC05, RC14 | Dominio y Aplicación independientes; Presentación/Infraestructura dependen del núcleo. |
| ADR-003 | Caché de carta por negocio | DA01, DA02, DA06 | TTL documentado de 20 s e invalidación; PostgreSQL confirma precio y stock. |
| ADR-004 | Contratos, transacciones y eventos | DA02–04 | Pedido y reserva coherentes; idempotencia; avisos posteriores a confirmar. |
| ADR-005 | Permisos y aislamiento por empresa | DA01, DA03 | Empresa por subdominio, autorización backend, RLS y salas acotadas. |
| ADR-006 | Web separada de API | DA03, DA05 | Next.js/React usa REST; Socket.IO comunica cambios; reconexión recupera estado persistido. |

Clean Architecture permite explicar de forma explícita qué reglas pertenecen al negocio, qué coordina un caso de uso y qué detalles pertenecen a la interfaz o la persistencia. Coincide con las cuatro responsabilidades trabajadas en el laboratorio y con la demostración existente. Esta elección organiza la propuesta y no acredita una reorganización desplegada en producción.

El monolito modular conserva transacciones y operación de una API. Los microservicios introducirían despliegues y coordinación distribuida sin una necesidad de independencia demostrada. Los módulos colaboran por contratos y no acceden al repositorio interno de otro módulo. La modularidad no garantiza capacidad ni continuidad ante la caída de la única instancia.

[Estilo](../02-arquitectura-software/estilo-arquitectonico.md) · [Enfoque](../02-arquitectura-software/enfoque-aquitectonico.md) · [Almacenamiento](../02-arquitectura-software/arquitectura-inicial.md#datos-y-recuperacion).
