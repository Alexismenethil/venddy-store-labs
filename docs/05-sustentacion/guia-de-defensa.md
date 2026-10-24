# Venddy Store: guía de sustentación del primer sprint

Alexis Huamani Rivera · IS-488 · Preparación del 23/10/2026.

## La decisión que defenderás

**Estilo: monolito modular. Enfoque único: Clean Architecture.** Ocho módulos se despliegan dentro de una API; cada responsabilidad se organiza alrededor de reglas y contratos del núcleo. La selección aplica a la propuesta del laboratorio. No afirmes que este repositorio demuestra una migración completa de producción.

Para Venddy y esta evaluación elegimos Clean porque ya existe una separación demostrable de Dominio, Aplicación, Presentación e Infraestructura, y permite relacionar con claridad cada decisión con los archivos y diagramas. La tecnología no decide las reglas de precios, stock y estados.

Tu respuesta debe conectar una necesidad del negocio con una decisión, señalar su evidencia y reconocer qué falta comprobar. Evita recitar una definición sin mostrar dónde se aplica.

## 1. ¿Cuál es tu flujo de trabajo?

**Respuesta oral:** “El comensal abre la carta del negocio por QR y selecciona productos. Al confirmar, el servidor resuelve el negocio, valida la solicitud y reconoce reintentos. Para un pedido nuevo comprueba precios y stock y confirma el pedido junto con la reserva. Después comunica la comanda a cocina. Preparación actualiza los estados; caja registra posteriormente el cobro y cierra su turno. Inventario y reportes mantienen la trazabilidad de esas operaciones”.

**Evidencia:** `img/flujo-pedido.png`; RF-01, RF-03 a RF-09; `RegistrarPedidoCasoUso` y su contrato de repositorio.

**Precisión:** confirmar el pedido no cobra ni solicita una pasarela. El recorrido de preparación es recibido, en preparación, listo y entregado. La cancelación del ejemplo solo se admite desde recibido; la devolución de stock por cancelación necesita su coordinación de aplicación.

Si se refiere al trabajo del equipo: primero analizamos actores e historias, precisamos requisitos, calidad y restricciones; seleccionamos drivers y ADR; dibujamos arquitectura/C4 y diseñamos Pedidos. Después verificamos reglas y dependencias, revisamos cambios, hacemos un commit convencional y publicamos el avance. Git no equivale a desplegar el producto.

## 2. ¿Cuáles son tus módulos?

| Módulo | Qué dirás | Requisitos |
|---|---|---|
| Catálogo y carta | Publica productos, precios y disponibilidad del negocio y los expone por QR. | RF-01–03 |
| Pedidos y cocina | Confirma pedidos idempotentes, distribuye comandas y controla preparación. | RF-04–06 |
| Caja y ventas | Gestiona turnos, cobros recibidos, arqueo, cierre y notas internas. | RF-07–08 |
| Inventario | Conserva existencias, ajustes y movimientos autorizados. | RF-09 |
| Administración | Configura personal, permisos y operación del negocio. | RF-02, 07, 09 |
| Plataforma SaaS | Da de alta negocios, administra planes y autoriza soporte. | RF-11 |
| Fidelidad | Aplica beneficios opcionales del negocio a cobros elegibles. | RF-12 |
| Reportes | Consulta y exporta ventas y caja con permisos y rango. | RF-10 |

**Respuesta de cierre:** “Son límites funcionales dentro del mismo backend. Pedidos utiliza servicios de Catálogo e Inventario; Caja registra el cobro posterior y colabora con Fidelidad. Un módulo no entra al repositorio privado de otro”.

El repositorio académico no contiene ocho backends implementados: demuestra una parte de carta y pedidos. La tabla anterior describe el sistema completo documentado.

## 3. ¿Qué estilo y enfoque usas y por qué?

**Respuesta oral:** “Usamos un monolito modular para mantener una sola API desplegable, con módulos delimitados por negocio. Dentro de esos módulos elegimos Clean Architecture: Dominio contiene las reglas; Aplicación coordina los casos de uso; Presentación recibe la interacción y las solicitudes; Infraestructura resuelve persistencia y comunicación mediante contratos. Esto responde principalmente a DA04, mantenibilidad, y permite comprobar el núcleo sin conectar proveedores”.

**Estilo y enfoque no compiten:** el estilo responde cómo se organiza y despliega el backend; el enfoque establece las responsabilidades y la dirección de las dependencias. Una web, una API y una base son elementos de C2, no tres enfoques. La propuesta usa cuatro responsabilidades de Clean de manera consistente.

**Evidencia:** ADR-001/ADR-002 y las figuras `diagrama-estilo-arquitectonico.png` y `diagrama-enfoque-arquitectonico.png`.

### ¿Por qué elegimos Clean en lugar de hexagonal?

**Respuesta oral:** “Para Venddy elegimos Clean porque ya separamos las reglas de Producto, Carrito y Pedido de los casos de uso y de las herramientas externas. Podemos demostrar esa separación en el ejemplo y sus pruebas, y relacionarla con los diagramas y las carpetas. Nos ayuda a mantener las reglas de precios, stock y estados sin mezclarlas con pantallas o persistencia. Por eso es la elección más conveniente para el alcance actual y su evaluación”.

**Comparación correcta:** hexagonal también permite aislar y probar el negocio mediante puertos y adaptadores. Esos beneficios no son exclusivos de Clean. Clean explicita entidades, casos de uso y la dirección de las dependencias que estamos mostrando. No hay evidencia para afirmar que una sea automáticamente más rápida, segura o disponible. La elección requiere mantener límites y añade abstracciones que no conviene introducir sin necesidad.

**¿Los contratos y adaptadores significan que seguimos usando otro enfoque?** No. Clean utiliza interfaces del núcleo e implementaciones externas para invertir dependencias. Tener `RepositorioPedidos` y un adaptador no contradice el enfoque elegido.

Fuentes primarias: [Robert C. Martin, Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) y [Alistair Cockburn, Ports and Adapters](https://alistair.cockburn.us/hexagonal-architecture/). La preferencia para Venddy es una decisión del proyecto basada en su estructura y alcance, no una clasificación universal.

### ¿Por qué el gráfico del monolito tiene tres capas y Clean cuatro responsabilidades?

El gráfico original del monolito agrupa la ejecución en Presentación, Negocio y Datos. En la vista detallada, Negocio se separa en Aplicación y Dominio; Datos corresponde a mecanismos de Infraestructura. Las cuatro carpetas son una organización interna. Las flechas de ejecución del monolito no establecen la dirección de imports. El gráfico original de Clean sí muestra dependencias hacia el núcleo. No contamos carpetas para decidir si se cumple Clean: comprobamos responsabilidades y dependencias.

## 4. ¿Por qué monolito modular y no microservicios?

**Respuesta oral:** “Nuestro recorrido exige coherencia entre pedido, inventario y cobro, y no tenemos una necesidad medida de desplegar cada módulo por separado. Una API reduce la operación distribuida mientras los límites modulares mantienen las responsabilidades. Si una función necesitara carga o despliegue independiente, lo justificaríamos con evidencia antes de extraerla”.

**Límite que debes admitir:** una excepción de negocio se puede manejar sin derribar el proceso; si cae el proceso de la API, todos sus módulos pierden servicio. Modularidad no significa alta disponibilidad ni aislamiento físico de fallas. Escalar la API replica el backend completo; varias instancias necesitan coordinar eventos, estado compartido y conexiones.

## 5. ¿Qué requisitos y drivers justifican esas decisiones?

| Necesidad concreta | Cadena de justificación |
|---|---|
| Cada negocio solo opera sus datos. | RF-01/RF-06 y AC01 sostienen DA01; ADR-005 aplica contexto, permisos, RLS y salas por empresa. |
| Un reintento no duplica el pedido. | RF-05 y AC03 sostienen DA02; ADR-004 exige idempotencia y registro consistente. |
| Cocina y caja comparten un estado fiable. | RF-06/RF-07 sostienen DA03; ADR-006 usa REST y eventos después de confirmar. |
| Cambiar proveedores sin rehacer reglas. | AC05 sostiene DA04; ADR-001/002 seleccionan modularidad y Clean. |
| La carta recibe consultas repetidas. | DA06 sostiene ADR-003; caché acotada por negocio con TTL documentado de 20 s e invalidación. |

No renumeres drivers: DA04 es mantenibilidad; DA06 es capacidad medida. La caché no decide precios o existencias al confirmar.

DA05 trata la continuidad del frontend; DA07, archivos; DA08, recuperación; DA09, observabilidad; DA10, entrega y migraciones. Están documentados aunque en la exposición se prioricen los riesgos del pedido.

## 6. Si falla un módulo o el sistema, ¿cómo lo solucionas?

**Caso que debes defender primero:** “Si el pedido ya se guardó pero falla el aviso a cocina, no creo otro pedido ni vuelvo a descontar stock. Conservo el pedido y devuelvo aviso pendiente. Reintento con la misma clave, recupero el pedido original y vuelvo a intentar la notificación. En el sistema, cocina puede recuperar el estado persistido por REST cuando se restablece la comunicación”.

**Evidencia académica:** `registrar-pedido.caso-uso.ts` captura el fallo del notificador; el repositorio recuerda la clave; la prueba de aviso fallido comprueba que no se duplica pedido ni stock. La entrega remota por Socket.IO requiere su integración de backend; el ejemplo activo avisa por consola.

| Fallo | Respuesta y límite |
|---|---|
| Se pierde la respuesta después de guardar. | Repetir la misma clave y contenido devuelve el pedido anterior antes de revisar existencias otra vez. |
| Precio cambiado o stock insuficiente. | El servidor usa datos actuales y valida todas las líneas; rechaza sin descuentos parciales. |
| Falla una regla de negocio. | Responder con un error controlado y conservar la transacción sin confirmar. No es lo mismo que caer el proceso. |
| Se corta Socket.IO. | Reconectar y recuperar por REST. Los eventos no son la fuente de verdad. No prometer polling automático si aún no se ha implementado. |
| Cae la API. | Detectar, reiniciar o revertir y comprobar salud. Durante la caída no hay otra API de respaldo sirviendo tráfico. |
| Falla PostgreSQL. | No confirmar una operación incompleta. Gestionar rollback/error, diagnosticar y reintentar idempotentemente. |
| Se pierden datos. | Restaurar una copia válida en el entorno separado, comprobarla y promoverla manualmente con controles. No asumir failover automático. |
| Falla el proveedor de fotos. | Diseñar imagen alternativa y reintento del recurso. El precio/stock permanecen en PostgreSQL; validar ese comportamiento de interfaz antes de prometer degradación controlada. |

No respondas “lo paso a otro módulo” o “Clean lo soluciona solo”. Clean facilita localizar responsabilidades; la recuperación necesita mecanismos operativos y datos consistentes.

## 7. ¿Cuáles son las revisiones de tus atributos de calidad?

Habla de la comprobación y su evidencia, no solo del nombre del atributo.

| Atributo | Revisión que propones o puedes mostrar |
|---|---|
| AC01: aislamiento | Dos negocios y roles distintos; intentar leer, modificar y recibir datos cruzados. |
| AC02: autorización | Revocar sesión o permiso y repetir la operación REST y de eventos; no debe persistir el cambio. |
| AC03: integridad | Repetir la misma clave, reutilizarla con otro contenido y competir por la última unidad; sin duplicados ni stock negativo. |
| AC04: rendimiento | Ensayo con datos y mezcla realista de operaciones; registrar p95, errores, memoria y conexiones. No inventar una cifra de negocios soportados. |
| AC05: mantenibilidad | Revisar imports y probar casos de uso con adaptadores del mismo contrato. |
| AC06: portabilidad | Ensayar SSR, subdominios, sesiones, imágenes e identidad en el runtime objetivo antes de cambiar DNS. |
| AC07: disponibilidad | Cortar/reiniciar la API, medir interrupción y verificar recuperación del estado al reconectar. |
| AC08: recuperabilidad | Restaurar datos, roles, RLS y referencias a fotos en otra base; medir pérdida y tiempo reales. |
| AC09: observabilidad | Provocar error y respaldo fallido; relacionar logs y alerta por requestId, sin cookies ni tokens en trazas. |
| AC10: entrega | Forzar un fallo de comprobaciones; el release no debe publicar. Verificar migraciones y controles SQL. |

**Escenario de seis partes que debes memorizar:** fuente: comensal; estímulo: reintento del mismo pedido; artefacto: Pedidos/Inventario; entorno: respuesta perdida después de confirmar; respuesta: devolver el pedido original; medida: una identidad y una reserva. Otro contenido con la misma clave se rechaza.

La ejecución local del 23/10/2026 aprobó las 21 pruebas existentes del núcleo. Eso no equivale a una aceptación de seguridad, rendimiento o recuperación del sistema completo.

## 8. ¿Por qué usas dos bases de datos?

**Respuesta oral:** “La base principal de PostgreSQL en Neon atiende la operación: pedidos, cobros, usuarios y existencias. La base separada de recuperación es un objetivo para restaurar y comprobar copias sin tocar la principal. No recibe tráfico comercial, no se escribe en paralelo y no actúa como una réplica de alta disponibilidad”.

Si la docente señala Neon y R2: “Esos dos recursos no son dos bases SQL: Neon aloja PostgreSQL; R2 es almacenamiento de objetos. Las fotos o los archivos no sustituyen las transacciones de pedidos”.

Si pregunta por qué separarlas: puedes comprobar una copia, roles y políticas sin alterar ventas activas. Una instancia de restauración bajo demanda reduce el uso permanente respecto a mantener otra base activa, aunque costo y cuotas deben comprobarse antes de contratar. Separar proyectos no resuelve por sí solo todas las fallas del proveedor.

## 9. ¿Cuál guarda archivos y cuál permite funcionar al sistema?

**Respuesta oral:** “PostgreSQL conserva datos relacionados y transacciones: productos, pedidos, cobros y stock. Las fotografías se guardan como objetos y se entregan por URL/CDN; la base conserva sus referencias. Los respaldos van a un espacio privado con permisos diferentes al de fotos públicas”.

El informe del 02/10/2026 describió Cloudinary para fotos. R2 es el objetivo de migración y respaldo. No afirmes que R2 está configurado hoy sin verificar el despliegue. PostgreSQL es el motor y Neon el proveedor; Prisma es el mecanismo de acceso de la API, no otra base.

**RPO/RTO:** RPO objetivo externo de 24 h expresa la pérdida de datos que se busca limitar con una copia utilizable; RTO objetivo de 2 h expresa el tiempo que se busca cumplir para recuperar servicio. Deben medirse con simulacros. Si una copia falla, su periodicidad nominal no garantiza esos valores. PITR y copias externas se complementan.

## 10. Explica C1, C2, C3 y C4

### C1: contexto

Señala Venddy en el centro. A la izquierda, comensal y administrador; a la derecha, preparación/caja y plataforma/soporte. Google Identity aparece para fidelidad opcional. Explica quién hace qué y los permisos; no empieces por tablas o métodos. Esta vista justifica los límites de la solución y el acceso multiempresa.

### C2: contenedores

Abre Venddy en web Next.js/React, API Express/Socket.IO, PostgreSQL y almacenamiento de fotos. La web opera por REST y recibe eventos; la API autoriza y persiste mediante Prisma. Prisma no es otro contenedor. La base de recuperación pertenece al procedimiento de restauración, sin una flecha de ventas desde la API. Un contenedor C4 no implica Docker.

### C3: componentes

Abre únicamente la API. Señala los ocho módulos y el contexto autorizado antes de delegar. Pedidos consulta Catálogo y coordina Inventario. Caja registra el cobro posterior y colabora con Fidelidad. Reportes usa consultas autorizadas. Cada módulo mantiene sus repositorios; las flechas de esta figura son colaboraciones durante la ejecución, no ocho servicios remotos.

### C4: clases y contratos

Detalla Pedidos. `RegistrarPedidoCasoUso` usa `RepositorioPedidos` y `NotificadorPedido`; recibe un `Pedido`. Los adaptadores `RepositorioPedidosMemoria` y `NotificadorConsola` implementan esos contratos. `LineaPedido` es una interfaz incluida en el modelo, no una clase separada que debas buscar en otro archivo.

Las dependencias del diseño apuntan al contrato del núcleo. En la secuencia, el recorrido sí es temporal: entrada, registro, precios/stock para un pedido nuevo, confirmación y aviso. Las flechas de dependencias y de secuencia contestan preguntas distintas.

**Pregunta trampa:** si un repositorio nuevo tiene los mismos métodos pero duplica pedidos al reintentar, no cumple el contrato ni el comportamiento de sustitución. La firma de TypeScript por sí sola no prueba idempotencia.

## 11. ¿Cómo aplicas patrones y SOLID en nuestro diseño?

Repository separa la persistencia de las reglas de Pedidos. Adapter conecta memoria, HTTP o avisos al contrato que utiliza el núcleo. Los eventos/Observer se proponen para comunicar un pedido confirmado sin incluir la pantalla de cocina en Pedidos; no afirmes que el ejemplo tiene un bus de eventos remoto activo.

Responsabilidad única separa entidad, caso de uso, repositorio y aviso. Abierto/cerrado permite añadir un adaptador. Sustitución exige respetar empresa, idempotencia e integridad. Segregación separa productos, pedidos, cobros y notificaciones. Inversión hace que el caso de uso reciba contratos.

`app.config.ts` es la raíz de composición: conecta las implementaciones. Los tokens de Angular identifican las dependencias en ejecución porque las interfaces de TypeScript desaparecen al compilar. Los tokens permanecen fuera del dominio.

## 12. ¿Por qué el ejemplo usa Angular si el sistema usa Next.js?

“El sistema documentado utiliza Next.js/React, Express/Socket.IO y Prisma/PostgreSQL. Este repositorio del laboratorio contiene además una demostración Angular para estudiar las cuatro responsabilidades de Clean. No estamos diciendo que Angular haya reemplazado nuestro frontend ni que sus mapas en memoria sean Neon”.

El ejemplo activo usa memoria y consola. Sus parámetros de negocio/mesa dan contexto ficticio, no autentican. Los adaptadores HTTP y de avisos son ilustrativos, sin URL configurada. Cocina, caja completa, PostgreSQL y WebSocket del sistema requieren su implementación e integración; no se acreditan por ejecutar el ejemplo.

## 13. Recorrido recomendado para exponer

| Diapositiva | Qué explicar |
|---|---|
| 1. Venddy Store | Problema del negocio y elección: monolito modular con Clean. |
| 2. Flujo | QR, carta, pedido, preparación, cobro y cierre. El servidor valida antes de confirmar. |
| 3. Requisitos | Negocio correcto, precio/stock, reintentos, preparación y caja. |
| 4. Drivers | Relacionar aislamiento, integridad, coordinación y mantenibilidad con sus ADR. |
| 5. C1 | Usuarios de Venddy y servicio opcional de identidad. |
| 6. C2 | Web, API, PostgreSQL y archivos. |
| 7. Monolito original | Actores, cliente web, cinco columnas, ocho módulos, datos y servicios externos. |
| 8. C3 | Colaboraciones entre los ocho módulos dentro de la API. |
| 9. Clean original | Círculos, cuatro carpetas, contratos internos y raíz de composición. |
| 10. C4: clases | Caso de uso, Pedido, interfaces y adaptadores del ejemplo. |
| 11. Repository y Adapter | Contrato de productos e implementaciones de memoria/HTTP. |
| 12. Observer | Publicación del pedido confirmado y suscriptores autorizados; diseño propuesto. |
| 13. SOLID | Responsabilidades, sustitución e inversión aplicadas a los archivos del ejemplo. |
| 14. Secuencia | Registrar, confirmar y después avisar. El reintento se reconoce antes de reservar de nuevo. |
| 15. Almacenamiento | Diferenciar datos operativos, fotos, respaldo y restauración bajo demanda. |
| 16. Calidad | Qué se prueba en memoria y qué revisiones integrales siguen pendientes. |

Los casos de falla, la comparación con el enfoque anterior y las preguntas de defensa se estudian fuera del PPT. Responde primero en 30–45 segundos y amplía abriendo la evidencia cuando la docente lo pida. Las diapositivas 7 y 9 usan los archivos originales recuperados, sin redibujar sus gráficos.

## 14. Mapa de carpetas

| Carpeta | Por qué existe | Qué mostrar |
|---|---|---|
| `docs/01-analisis-de-sistema/` | Justifica qué necesita el negocio y qué condiciona el diseño. | Requisito, driver, ADR y escenario relacionados. |
| `docs/02-arquitectura-software/` | Define módulos, límites, enfoque, datos y respuestas a fallos. | La figura y la decisión que resuelve un riesgo de Venddy. |
| `docs/03-diseño-de-software/diseño-interno/` | Detalla responsabilidades y colaboración de Pedidos. | Clases, contratos, secuencia, patrones y SOLID aplicados. |
| `docs/04-modelo-c4/` | Comunica la misma solución desde contexto hasta clases. | Elegir el nivel de detalle adecuado a la pregunta. |
| `docs/05-sustentacion/` | Reúne la preparación oral y este inventario. | Preguntas y enlaces de evidencia. |
| `arquitectura/` | Conserva los originales de estilo y Clean restaurados sin redibujar. | Círculos de Clean y monolito de cinco columnas; PNG, SVG y PDF. |
| `img/` | Guarda C4 y diagramas complementarios. | PNG para pantalla; PDF para ampliar o imprimir. |
| `img/fuentes-svg/` | Conserva el diagrama editable y trazable. | La fuente SVG, que permite actualizar textos y relaciones. |
| `tecnologia/boilerplate-clean-arquitecture/` | Aísla la demostración tecnológica de la documentación. | Su README y las cuatro responsabilidades de `src/app/`. |
| `src/app/dominio/modelos/` | Conserva reglas que siguen siendo válidas sin framework. | Precio en céntimos, stock y estados válidos. |
| `src/app/dominio/contratos/` | Describe lo que el núcleo requiere de sus colaboradores. | Métodos y garantías del repositorio y notificador. |
| `src/app/aplicacion/` | Coordina los casos de uso. | Validar contexto, registrar y avisar en ese orden. |
| `src/app/infraestructura/` | Implementa los contratos con mecanismos concretos. | Memoria/consola activos y HTTP ilustrativo. |
| `src/app/presentacion/` | Traduce la interacción del comensal. | Los componentes no deciden precios confirmados. |
| `src/app/pruebas/` | Verifica reglas y colaboraciones del núcleo. | Casos de reintento, último stock y aviso fallido. |

## 15. Archivo por archivo


### Documentación de análisis, arquitectura y diseño

| Archivo | Qué contiene | Por qué está aquí |
|---|---|---|
| `docs/01-analisis-de-sistema/01-actores.md` | Identifica participantes, permisos y responsabilidades. | Permite delimitar a quién sirve Venddy antes de elegir componentes. |
| `docs/01-analisis-de-sistema/02-historias-del-usuario.md` | Relaciona doce necesidades de usuarios con sus RF. | Conserva el valor que motiva cada función. |
| `docs/01-analisis-de-sistema/03-requisitos-funcionales.md` | Doce capacidades y sus criterios de aceptación. | Evita diseñar módulos sin una necesidad trazable. |
| `docs/01-analisis-de-sistema/04-atributos-de-calidad.md` | Diez atributos con revisiones, evidencias y límites. | Permite defender cómo se evaluará la calidad. |
| `docs/01-analisis-de-sistema/05-restricciones.md` | Catorce condiciones del proyecto y sus límites de alcance. | Delimita tecnologías, internet, seguridad y operación. |
| `docs/01-analisis-de-sistema/06-driver-arquitectonicos.md` | Diez condiciones que afectan estructura y operación. | Prioriza qué exige una decisión arquitectónica. |
| `docs/01-analisis-de-sistema/07-decisiones-arquitectonicas.md` | Seis ADR; selección única Clean y monolito modular. | Registra qué elegimos, por qué y con qué consecuencias. |
| `docs/01-analisis-de-sistema/08-escenarios-atributos-calidad.md` | Fuente, estímulo, artefacto, entorno, respuesta y medida para diez escenarios. | Convierte los atributos en comprobaciones concretas. |
| `docs/02-arquitectura-software/almacenamiento-y-recuperacion.md` | Principal, fotos, respaldo privado y base de recuperación separados. | Responde a las preguntas sobre dos bases y archivos. |
| `docs/02-arquitectura-software/arquitectura-inicial.md` | Arquitectura general seleccionada, stack y relaciones. El nombre conserva el esquema del laboratorio. | Es la entrada a la propuesta activa del primer sprint, sin otra selección de enfoque. |
| `docs/02-arquitectura-software/componentes-arquitectonicos.md` | Responsabilidad de cada módulo y sus RF. | Relaciona el diseño modular con el análisis del negocio. |
| `docs/02-arquitectura-software/enfoque-aquitectonico.md` | Cuatro responsabilidades de Clean y dependencias permitidas. | Justifica ADR-002 y ubica los contratos del núcleo. |
| `docs/02-arquitectura-software/estilo-arquitectonico.md` | Una API, ocho módulos, límites y consecuencias del despliegue único. | Justifica ADR-001 y evita llamar microservicios a los módulos. |
| `docs/02-arquitectura-software/manejo-de-fallos.md` | Respuestas para avisos, red, API, PostgreSQL, pérdida de datos e imágenes. | Distingue errores controlados y caída del proceso. |
| `docs/03-diseño-de-software/diseño-interno/diseño-interno-de-modulos.md` | Clases, interfaces y registro de Pedidos; garantías y límites locales. | Explica cómo colaborar sin introducir proveedores en el núcleo. |
| `docs/03-diseño-de-software/diseño-interno/patrones-de-diseño.md` | Repository, Adapter y eventos propuestos con ejemplos de Venddy. | Justifica patrones por el problema que resuelven. |
| `docs/03-diseño-de-software/diseño-interno/principios-de-diseño.md` | SOLID aplicado a entidades, casos de uso, contratos y adaptadores. | Permite revisar responsabilidades y sustitución sin recitar teoría. |
| `docs/04-modelo-c4/Nivel1-DiagramadeContextodelSistema.md` | Usuarios, Venddy y contexto externo. | Responde quién utiliza la solución. |
| `docs/04-modelo-c4/Nivel2-DiagramadeContenedores.md` | Web, API, PostgreSQL y almacenamiento. | Responde qué aplicaciones/almacenes se comunican. |
| `docs/04-modelo-c4/Nivel3-Diagrama-de-Componentes.md` | Ocho módulos dentro de la API y colaboraciones. | Responde cómo se organiza el backend por dentro. |
| `docs/04-modelo-c4/Nivel4-DiagramadeCodigo.md` | Clases, contratos y secuencia de Pedidos. | Responde cómo se implementaría y verifica una responsabilidad concreta. |

### Ejemplo tecnológico: archivos y configuración

Las rutas siguientes parten de `tecnologia/boilerplate-clean-arquitecture/`.

| Archivo | Qué contiene | Motivo y límite |
|---|---|---|
| `.editorconfig` | Define formato de texto como indentación y fin de línea. | Mantiene consistencia de edición entre herramientas. |
| `.gitignore` | Excluye dependencias, compilados, caché y archivos locales. | No se publican node_modules ni resultados reproducibles como si fueran fuentes. |
| `.vscode/extensions.json` | Sugiere extensiones de editor. | Es ayuda de desarrollo, no una dependencia del sistema. |
| `.vscode/launch.json` | Describe lanzamientos de depuración en VS Code. | Facilita revisar el ejemplo; no define despliegue productivo. |
| `.vscode/tasks.json` | Define tareas del editor para comandos del proyecto. | Automatiza el trabajo local del desarrollador. |
| `README.md` | Explica arranque, cuatro responsabilidades, registro y límites de la demostración. | Es el primer archivo que debes abrir antes de ejecutar o afirmar capacidades. |
| `angular.json` | Configura venddy-limpio, rutas de entrada/assets, compilación, servidor y Karma. | Describe la herramienta de la demostración. dist es resultado de build. |
| `package-lock.json` | Fija el árbol de versiones resuelto de npm. | npm ci reproduce dependencias; no contiene reglas ni se edita para diseñar módulos. |
| `package.json` | Declara dependencias y comandos start, build, pruebas, test y test:angular. | Hace reproducible cómo ejecutar el ejemplo; npm test utiliza las pruebas del núcleo. |
| `public/favicon.ico` | Icono estático del proyecto de demostración. | Es un recurso de interfaz y no una pieza arquitectónica. |
| `src/app/aplicacion/agregar-al-carrito.caso-uso.ts` | AgregarAlCarritoCasoUso busca el producto del negocio y delega cantidad/stock al Carrito. | La presentación no inventa el producto ni mezcla negocios. |
| `src/app/aplicacion/consultar-catalogo.caso-uso.ts` | ConsultarCatalogoCasoUso recibe RepositorioProductos y devuelve productos disponibles del negocio con el filtro. | Coordina una consulta sin importar un framework o construir persistencia. |
| `src/app/aplicacion/registrar-pedido.caso-uso.ts` | RegistrarPedidoCasoUso valida negocio/carrito, invoca registrarAtomico y después el notificador. Devuelve Pedido y avisoPendiente. | Coordina el orden y captura el fallo del aviso sin borrar un pedido confirmado. |
| `src/app/app.component.ts` | Componente raíz con encabezado de negocio/mesa y navegación Carta/Carrito. | Compone las vistas; no contiene reglas de inventario o transacciones. |
| `src/app/app.config.ts` | Raíz de composición: activa productos/pedidos en memoria, registrador de cobros y notificador de consola; entrega contratos a los casos de uso. | La elección concreta queda fuera del núcleo. Si se cambia a HTTP, deben sustituirse los adaptadores compatibles de toda la unidad de registro. |
| `src/app/dominio/contratos/notificador-pedido.contrato.ts` | Declara confirmarPedido(Pedido) para un pedido ya registrado. | El aviso no determina si existe el pedido; el núcleo conserva el mismo contrato al cambiar de canal. |
| `src/app/dominio/contratos/registrador-cobros.contrato.ts` | Describe el registro interno de un cobro y su resultado, con negocio, pedido, céntimos, medio y referencia. | Separa registrar dinero recibido de mover dinero mediante una pasarela. No participa al enviar el pedido. |
| `src/app/dominio/contratos/repositorio-pedidos.contrato.ts` | Declara RegistroPedido y RepositorioPedidos: registrarAtomico, buscarPorId y listarPorCliente. | El contrato exige coherencia de pedido/reserva, aislamiento e idempotencia, además de firmas de métodos. |
| `src/app/dominio/contratos/repositorio-productos.contrato.ts` | Declara FiltroCatalogo y operaciones listar, buscarPorId y guardar con negocioId. | El caso de uso conoce qué necesita, sin depender de HTTP o un Map. |
| `src/app/dominio/modelos/carrito.modelo.ts` | Define Carrito y LineaCarrito; vacio, agregar, quitar, vaciar y total en céntimos. Conserva un solo negocio e instancias inmutables. | Las reglas de selección y sumas pertenecen al negocio, no a la pantalla. |
| `src/app/dominio/modelos/pedido.modelo.ts` | Define Pedido, LineaPedido y EstadoPedido. crear valida mesa/líneas/total. iniciarPreparacion, marcarListo, entregar y cancelar controlan estados. | El pedido conserva importes confirmados y rechaza transiciones inválidas. LineaPedido es interfaz en este mismo archivo. |
| `src/app/dominio/modelos/precios.ts` | Valida céntimos y cantidades enteras, calcula importes y formatea soles. | Evita errores de coma flotante y sumar otra vez impuestos o comisiones al precio final. |
| `src/app/dominio/modelos/producto.modelo.ts` | Define Producto, categorías, negocio, precioCentimos y stock. Valida constructor y descuenta devolviendo una entidad nueva. | El dominio protege valores válidos y evita que el carrito modifique el inventario por referencia. |
| `src/app/infraestructura/notificador-consola.ts` | Avisa en consola y evita repetir la entrega del mismo negocio/pedido. | Es el canal activo que permite demostrar el flujo sin un servidor de eventos. |
| `src/app/infraestructura/notificador-tiempo-real.ts` | Publica por HTTP un aviso con clave de pedido hacia un backend propuesto. Ese backend distribuiría por tiempo real. | No es un cliente Socket.IO operativo ni tiene URL configurada en el ejemplo. |
| `src/app/infraestructura/registrador-cobros-http.ts` | Traduce el registro interno de cobro a una solicitud HTTP propuesta. | Permite estudiar el reemplazo técnico; no acredita un servicio conectado ni una pantalla de caja completa. |
| `src/app/infraestructura/registrador-cobros-memoria.ts` | Valida el registro interno y recuerda referencias para rechazar una reutilización con datos distintos. | Demuestra el contrato de caja; no verifica el saldo real de un pedido ni mueve dinero. |
| `src/app/infraestructura/repositorio-pedidos-memoria.ts` | Map de pedidos e intentos. La clave une negocio e idempotencia; una huella compara cliente, mesa y productos/cantidades. Reconoce el intento antes de reservar. | Garantiza idempotencia local y coordina pedido/reserva sin await intermedio. Depende del inventario de memoria, no de productos remotos. |
| `src/app/infraestructura/repositorio-productos-http.ts` | Implementa el contrato con HttpClient y transforma datos de una API propuesta. | Es un adaptador ilustrativo sin URL activa. Para usar inventario remoto también hace falta el registro transaccional remoto del pedido. |
| `src/app/infraestructura/repositorio-productos-memoria.ts` | Catálogo ficticio en Map con clave negocio/producto. reservarParaPedido prepara todas las líneas y aplica cambios solo después de validar. | Demuestra inventario aislado y sin descuentos parciales en un único proceso local. |
| `src/app/infraestructura/tokens.ts` | Crea los InjectionToken de productos, pedidos, cobros y notificación. | Angular necesita identificadores en ejecución; las interfaces desaparecen al compilar. El mecanismo queda fuera del dominio. |
| `src/app/presentacion/carrito/carrito.component.ts` | Muestra líneas y total, permite quitar y confirmar con una clave de intento, y comunica resultado/aviso pendiente. | La interfaz delega el registro al caso de uso; no cobra ni implementa una cocina operativa. |
| `src/app/presentacion/catalogo/catalogo.component.ts` | Muestra carta, categorías, disponibilidad y botón agregar; llama a los casos de uso y actualiza el estado compartido. | Traduce interacción del comensal sin guardar reglas del pedido en la pantalla. |
| `src/app/presentacion/estado-carrito.servicio.ts` | Lee contexto ficticio negocio/mesa de la URL y comparte Carrito con señales, cantidad, total y estado vacío. | Mantiene estado de interfaz. Una URL no autentica y este servicio no debe convertirse en autoridad del precio confirmado. |
| `src/app/pruebas/dominio.pruebas.ts` | Contiene 21 comprobaciones de valores, importes, estados, negocio, stock, precios, idempotencia, concurrencia local, fallo de aviso y dependencias. | Evidencia las garantías del núcleo. No comprueba RLS de producción, UI E2E, WebSocket remoto, carga ni restauración. |
| `src/index.html` | Contiene el documento HTML base y el punto donde Angular monta la aplicación. | El navegador necesita una página raíz; las vistas de carta/carrito se componen después. |
| `src/main.ts` | Arranca Angular con AppComponent y appConfig. | Es la entrada técnica, no un caso de uso del negocio. |
| `src/styles.css` | Define estilos globales del ejemplo. | La apariencia de la interfaz permanece separada de las reglas. |
| `tsconfig.app.json` | Selecciona entradas y compilación de la aplicación. | Separa los tipos del navegador de otros objetivos. |
| `tsconfig.json` | Configura reglas generales de TypeScript. | Evita que cada carpeta compile con supuestos diferentes. |
| `tsconfig.pruebas.json` | Compila dominio, aplicación y adaptadores locales hacia dist-pruebas para ejecutar con Node. | Permite probar el núcleo sin levantar Angular o un navegador. |
| `tsconfig.spec.json` | Conserva configuración de pruebas de componentes de Angular/Karma. | No significa que existan pruebas .spec.ts implementadas; es configuración del proyecto. |

### Gráficas y fuentes

Los originales se conservan en `arquitectura/diagrama-estilo-arquitectonico.{png,pdf,svg}` y `arquitectura/enfoque/diagrama-enfoque-arquitectonico.{png,pdf,svg}`. Cada PNG muestra el gráfico, el PDF permite ampliarlo y el SVG conserva su fuente editable. `arquitectura/README.md` identifica su procedencia.

Las vistas complementarias mantienen `img/<nombre>.png`, `img/<nombre>.pdf` e `img/fuentes-svg/<nombre>.svg`. Los formatos representan la misma vista.

| Nombre | Qué contiene y por qué |
|---|---|
| `diagrama-arquitectura` | Web, API, PostgreSQL y fotos; comunica la estructura general seleccionada. |
| `diagrama-estilo-arquitectonico` | Original de cinco columnas que agrupan ocho módulos y tres responsabilidades globales. Sus flechas representan ejecución. |
| `diagrama-enfoque-arquitectonico` | Original de círculos concéntricos y panel de dependencias aplicado a las cuatro carpetas de Venddy. |
| `flujo-pedido` | Atención desde QR hasta cierre y validación del pedido; explica el recorrido del negocio. |
| `almacenamiento-y-recuperacion` | Principal, fotos, respaldo privado y base de restauración; evita confundir datos con objetos o una copia con failover. |
| `nivel1-contexto` | Personas, Venddy y servicio opcional de identidad; responde quién interactúa. |
| `nivel2-contenedores` | Aplicaciones y almacenes; responde qué se ejecuta o conserva datos. |
| `nivel3-componentes` | Ocho módulos dentro de la API y sus colaboraciones. |
| `nivel4-clases` | Caso de uso, entidad, interfaces y adaptadores de Pedidos. |
| `nivel4-secuencia` | Orden temporal del registro y aviso para un pedido nuevo. |

### Archivos de la raíz y generados

`README.md` presenta Venddy, la decisión única, el alcance y los enlaces. `.gitignore` evita publicar secretos, dependencias y compilados. `docs/05-sustentacion/guia-de-defensa.md` es esta guía. El historial Git conserva revisiones anteriores; no son una propuesta activa adicional.

`node_modules/` contiene librerías instaladas. `dist/` contiene la aplicación compilada. `dist-pruebas/` contiene JavaScript de las pruebas. `.angular/` es caché de la herramienta. Se regeneran y no son carpetas del dominio ni módulos de Venddy.

## 16. Preguntas de seguimiento para ensayar

**¿El precio del carrito es definitivo?** No. Un pedido nuevo relee el precio del inventario; un pedido ya confirmado conserva sus importes aunque cambie el catálogo.

**¿Qué pasa al reintentar después de agotar la última unidad?** Primero se busca el intento. Si coincide, se devuelve el pedido anterior sin exigir de nuevo el stock que ya se reservó.

**¿Puede un comensal cambiar negocioId para ver otro negocio?** En el ejemplo, el parámetro solo cambia contexto ficticio y no prueba autenticación. En el sistema, el backend resuelve la empresa y los permisos autorizados y PostgreSQL refuerza ese ámbito mediante RLS.

**¿Los eventos son la base de datos?** No. Comunican cambios de una operación confirmada; REST permite recuperar el estado persistido si se pierde un evento.

**¿Redis es la segunda base que necesita Venddy?** No se incorpora Redis para la primera API objetivo. La caché acotada de carta no reemplaza PostgreSQL. La segunda base documentada es el entorno de recuperación, que no sirve tráfico de ventas.

**¿Cancelar un pedido ya devuelve existencias?** El dominio controla la transición desde recibido, pero la demostración no coordina la liberación de inventario. Se necesita un caso de uso y una transacción que conserven los movimientos.

**¿Puedo afirmar que todos los requisitos están funcionando por estas pruebas?** No. Las 21 pruebas son del núcleo y adaptadores locales. La aceptación del sistema completo incluye roles, subdominios, SQL, eventos, carga y recuperación.

**¿Cómo comprobas Clean?** Abrir el caso de uso y sus contratos; comprobar que no importa Angular, Express, Prisma o adaptadores. Abrir la composición y mostrar que las implementaciones se seleccionan afuera.

## 17. Qué tener abierto antes de exponer

El PPT, este guion, el README del repositorio, los ADR, el documento de datos/recuperación y los cuatro C4. Si piden evidencia de archivos, abre `RegistrarPedidoCasoUso`, `RepositorioPedidos`, `RepositorioPedidosMemoria`, `Pedido` y `app.config.ts` en ese orden. No necesitas iniciar sesión en producción ni revelar credenciales para sustentar las decisiones.

## Fuentes de diseño

- [Documentación de Venddy](https://github.com/Alexismenethil/venddy-store-labs).
- [The Clean Architecture, Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).
- [Modelo C4](https://c4model.com/diagrams).
- [Cloudflare R2: almacenamiento de objetos](https://developers.cloudflare.com/r2/).

Los objetivos operativos se originan en el informe de Venddy del 02/10/2026; las fuentes de producto no demuestran que una configuración esté desplegada. Esta preparación actualiza los documentos del laboratorio al 23/10/2026.
