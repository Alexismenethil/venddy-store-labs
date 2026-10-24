# Arquitectura inicial de Venddy

**Estilo:** monolito modular. **Enfoque:** Clean Architecture.

![Arquitectura general](../../img/nivel2-contenedores.png)

| Elemento | Función |
|---|---|
| Next.js / React | Carta QR y pantallas de cocina, caja y administración. |
| API Express / Socket.IO | Autorización, casos de uso y comunicación por negocio. |
| Prisma / PostgreSQL en Neon | Persistencia y transacciones de pedidos, cobros y stock. |
| Almacenamiento de objetos | Fotografías y archivos; PostgreSQL conserva sus referencias. |

La API conserva empresa y permisos en cada operación. Confirma el registro antes de avisar; al reconectar, los clientes recuperan el estado por REST. Las credenciales permanecen en el servidor.

## Datos y recuperación

PostgreSQL atiende la operación. Las fotografías usan almacenamiento externo: Cloudinary en el informe del 02/10/2026 y R2 como objetivo de migración. Las copias deben conservarse en un espacio privado con permisos separados.

La base de recuperación propuesta permite restaurar y validar copias en un entorno aislado bajo demanda. No recibe tráfico comercial ni implica réplica activa o conmutación automática. Los objetivos RPO 24 h y RTO 2 h requieren ensayos de restauración.

[Componentes](componentes-arquitectonicos.md) · [Estilo](estilo-arquitectonico.md) · [Enfoque](enfoque-aquitectonico.md).
