# Venddy Store · Laboratorio de arquitectura de software

Plataforma web multiempresa para negocios de comida: carta por QR, pedidos, preparación, caja y administración. Este repositorio desarrolla su análisis y arquitectura; el sistema se conocía anteriormente como FaciPOS.

## Información del proyecto

| Campo | Detalle |
| :--- | :--- |
| Curso | Arquitectura de Software |
| Docente de teoría | Ing. Richard Zapata Casaverde |
| Docente de laboratorio | **LIZBETH JAICO QUISPE** |
| Estudiante | Alexis Huamani Rivera |
| Código | 27220106 |
| Caso de estudio | Venddy Store |
| Entregable | Análisis del sistema y arquitectura inicial de lanzamiento |
| Sitio actual | [venddy.store](https://venddy.store) |

## Descripción general

El comensal consulta la carta de un negocio y envía su pedido desde el navegador. El personal recibe las comandas en sus estaciones de preparación, registra el cobro y realiza el cierre de caja. El administrador del negocio configura productos, inventario y permisos; el operador de Venddy gestiona los negocios y el servicio de la plataforma.

La arquitectura aprobada para el lanzamiento mantiene **tres capas**, un **monolito modular** y **puertos y adaptadores en el backend**. El aislamiento por empresa, las transacciones y la idempotencia protegen pedidos, cobros y stock. La propuesta incorpora entrega controlada, supervisión y recuperación comprobable.

## Arquitectura inicial

![Arquitectura oficial de Venddy Store: presentación, backend modular hexagonal, persistencia e integraciones](arquitectura/diagrama-arquitectura.png)

| Vista | Contenido |
| :--- | :--- |
| Presentación | Next.js y React para comensales, caja, cocina, personal y plataforma. |
| Aplicación y negocio | Express y Socket.IO como entradas; casos de uso por módulo y reglas puras en core. |
| Persistencia e integraciones | Prisma/PostgreSQL, R2 para fotografías y emisión de eventos tras confirmar la transacción. |
| Despliegue objetivo | Workers y OpenNext, una API en Render Starter, Neon Launch, R2/CDN y respaldo privado. |
| Recuperación | Copia diaria, PITR y restauración en una base separada bajo demanda. |

[Leer la propuesta completa](arquitectura/arquitectura-inicial.md) · [Abrir el HTML original y sus cinco vistas](arquitectura/arquitectura-inicial.html) · [Explorar el diagrama complementario con Archify](arquitectura/arquitectura-archify.html)

La arquitectura y el despliegue oficiales son **objetivos pendientes de implementación y aceptación**. La nube actual, verificada el 2 de octubre de 2026, utiliza Vercel, Render Free, Neon y Cloudinary. El HTML original conserva la arquitectura actual, el desarrollo local, la nube actual y las dos vistas oficiales de lanzamiento. Archify ofrece una exploración complementaria de la misma arquitectura objetivo.

## Estructura del repositorio

```text
venddy-store-labs/
├── .gitignore
├── README.md
├── analisis-de-sistema/
│   ├── 01-actores.md
│   ├── 02-historias-del-usuario.md
│   ├── 03-requisitos-funcionales.md
│   ├── 04-atributos-de-calidad.md
│   ├── 05-restricciones.md
│   └── 06-driver-arquitectonicos.md
└── arquitectura/
    ├── arquitectura-inicial.md
    ├── arquitectura-inicial.html
    ├── diagrama-arquitectura.png
    ├── arquitectura-archify.architecture.json
    ├── arquitectura-archify.html
    ├── diagrama-archify.png
    ├── ARCHIFY-LICENSE.txt
    └── ARCHIFY-NOTICES.md
```

## Documentos del laboratorio

| Documento | Propósito |
| :--- | :--- |
| [01. Actores](analisis-de-sistema/01-actores.md) | Responsabilidades de comensales, personal, administradores y proveedores externos. |
| [02. Historias de usuario](analisis-de-sistema/02-historias-del-usuario.md) | Necesidades del usuario con criterios de aceptación y relación con los requisitos. |
| [03. Requisitos funcionales](analisis-de-sistema/03-requisitos-funcionales.md) | Doce capacidades del sistema y trazabilidad con las historias. |
| [04. Atributos de calidad](analisis-de-sistema/04-atributos-de-calidad.md) | Escenarios verificables de seguridad, integridad, rendimiento, mantenibilidad y operación. |
| [05. Restricciones](analisis-de-sistema/05-restricciones.md) | Condiciones técnicas y límites del lanzamiento. |
| [06. Drivers arquitectónicos](analisis-de-sistema/06-driver-arquitectonicos.md) | Requisitos que justifican decisiones de arquitectura. |
| [Arquitectura inicial](arquitectura/arquitectura-inicial.md) | Capas, módulos, puertos, adaptadores, nube actual, lanzamiento y recuperación. |

## Consulta del diagrama

El [HTML original](arquitectura/arquitectura-inicial.html) y la imagen principal del README se conservan. Sus cinco vistas mantienen su presentación y sus exportaciones en PNG, SVG y PDF. La exportación de lanzamiento incluye las dos vistas objetivo; la completa incluye las cinco.

El [diagrama complementario Archify](arquitectura/arquitectura-archify.html) está generado con **Archify 3.0.1**, el mismo motor utilizado por la referencia del laboratorio. Permite explorar componentes y relaciones, cambiar el tema, presentar y exportar como imagen o SVG. Funciona sin instalación ni conexión a servicios externos.

Su [especificación JSON](arquitectura/arquitectura-archify.architecture.json) conserva los componentes, las relaciones y la composición; [diagrama-archify.png](arquitectura/diagrama-archify.png) es una exportación del mismo visor. Para regenerarlo con Archify 3.0.1, ejecuta desde `arquitectura/`:

```bash
archify finalize architecture arquitectura-archify.architecture.json arquitectura-archify.html --quality showcase --json
```

Después de regenerar el HTML, usa **Exportar → PNG** en ese visor para actualizar también su imagen.

## Alcance y aceptación

El sistema requiere internet. Registra medios de pago y emite notas de venta internas; la pasarela de pagos en línea y la facturación electrónica ante SUNAT quedan fuera del alcance descrito. La existencia de una función en el código no acredita una nueva prueba en producción. La carga admisible, la portabilidad a Workers y los tiempos de recuperación se comprobarán antes del lanzamiento.

## Historial de trabajo

Los cambios se registran por entregable mediante Conventional Commits: `chore` para la estructura y `docs` para el análisis, la arquitectura y la presentación del repositorio. Los commits mantienen la secuencia del laboratorio de referencia y se publican por etapas en GitHub.

## Créditos de los diagramas

El diagrama complementario usa [Archify](https://github.com/tt-a1i/archify), con su [licencia MIT](arquitectura/ARCHIFY-LICENSE.txt), [avisos de terceros](arquitectura/ARCHIFY-NOTICES.md) y los avisos de fuentes conservados en el HTML. El diagrama principal y las cinco vistas originales emplean iconos Lucide y Simple Icons; sus avisos ISC, MIT y CC0 permanecen en ese archivo. Los logotipos identifican a los proveedores correspondientes.
