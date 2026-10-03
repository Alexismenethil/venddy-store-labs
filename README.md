# Venddy Store · Laboratorio de arquitectura de software

Plataforma web multiempresa para negocios de comida: carta por QR, pedidos, preparación, caja y administración. Este repositorio desarrolla su análisis y arquitectura; el sistema se conoce anteriormente como FaciPOS.

## Información del proyecto

| Campo | Detalle |
| :--- | :--- |
| Curso | Arquitectura de Software |
| Docente | Richard Zapata Casaverde |
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

[Leer la propuesta completa](arquitectura/arquitectura-inicial.md) · [Abrir las cinco vistas y exportar diagramas](arquitectura/arquitectura-inicial.html)

La arquitectura y el despliegue oficiales son **objetivos pendientes de implementación y aceptación**. La nube actual, verificada el 2 de octubre de 2026, utiliza Vercel, Render Free, Neon y Cloudinary. El diagrama interactivo distingue el estado actual, el desarrollo local y las dos vistas oficiales de lanzamiento.

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
    └── diagrama-arquitectura.png
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

Abre `arquitectura/arquitectura-inicial.html` en un navegador. El archivo funciona sin instalar dependencias ni conectarse a servicios externos. Las pestañas muestran cinco vistas; cada una puede exportarse en PNG, SVG o PDF. La exportación de lanzamiento incluye las dos vistas objetivo; la exportación completa incluye las cinco.

## Alcance y aceptación

El sistema requiere internet. Registra medios de pago y emite notas de venta internas; la pasarela de pagos en línea y la facturación electrónica ante SUNAT quedan fuera del alcance descrito. La existencia de una función en el código no acredita una nueva prueba en producción. La carga admisible, la portabilidad a Workers y los tiempos de recuperación se comprobarán antes del lanzamiento.

## Historial de trabajo

Los cambios se registran por entregable mediante Conventional Commits: `chore` para la estructura y `docs` para el análisis, la arquitectura y la presentación del repositorio. Los commits mantienen la secuencia del laboratorio de referencia y se publican por etapas en GitHub.

## Créditos de los diagramas

Los diagramas emplean iconos Lucide y Simple Icons. Sus avisos ISC, MIT y CC0 se conservan dentro del HTML. Los logotipos identifican a los proveedores correspondientes.
