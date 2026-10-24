# Manejo de fallos

| Caso | Estado que se conserva | Respuesta | Evidencia y límite |
|---|---|---|---|
| Aviso a cocina falla después del registro | Mantener pedido y reserva; indicar aviso pendiente. | Reintentar con la misma clave; no cobrar ni reservar otra vez. | El ejemplo demuestra aviso pendiente y reintento; distribución remota requiere backend. |
| Una regla o entrada es inválida | Rechazar antes de confirmar. | Corregir la entrada; registrar error controlado sin cambios parciales. | Reglas del núcleo demostrables; no implica aislamiento físico de módulos. |
| Se pierde la respuesta al confirmar | No asumir que el pedido falló. | Repetir la misma clave/contenido y recuperar el pedido original. | Idempotencia local demostrada; aceptación PostgreSQL pendiente. |
| Se interrumpe Socket.IO | Conservar PostgreSQL como autoridad. | Reconectar y consultar estado por REST; diseñar releer/polling controlado si hace falta. | No prometer un canal remoto activo en la demostración. |
| Cae el proceso de la API | La API completa pierde disponibilidad. | Detectar, reiniciar/revertir y comprobar salud; después recuperar estado. | Una instancia: todos los módulos comparten esa caída. Sin réplica automática. |
| Falla PostgreSQL o una transacción | No confirmar una operación incompleta. | Error controlado, rollback y reintento idempotente; diagnosticar antes de restaurar. | El ejemplo en memoria no demuestra fallos reales de PostgreSQL. |
| Se pierden o corrompen datos | Preservar evidencia y evitar seguir dañando datos. | Restaurar copia verificada en entorno separado, validar y promover manualmente con control. | RPO/RTO por ensayar; no hay failover implícito. |
| Falla la entrega de imágenes | No confundir foto con precio o existencia. | Diseñar imagen alternativa y reintento del recurso; conservar texto y datos válidos. | Respuesta de diseño; validar la interfaz antes de afirmar disponibilidad degradada. |

Un error controlado de un caso de uso y la caída del proceso son fallos distintos. Clean Architecture permite localizar responsabilidades; no reinicia servidores ni aporta alta disponibilidad por sí misma.
