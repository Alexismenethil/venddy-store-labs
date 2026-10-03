# Requisitos Funcionales

Los identificadores RF-01 a RF-12 corresponden al informe de arquitectura de Venddy. Los doce requisitos cuentan con soporte en el código revisado: esta condición describe implementación actual y no acredita una nueva prueba ni la aceptación del entorno de lanzamiento.

| ID | Requisito funcional | Criterio de aceptación |
| :--- | :--- | :--- |
| RF-01 | El sistema debe identificar cada negocio por su subdominio y atender únicamente los subdominios registrados. | Dos negocios registrados muestran sus cartas respectivas; el dominio raíz abre la plataforma y un subdominio inexistente devuelve 404. |
| RF-02 | El sistema debe permitir administrar catálogo, categorías, variantes, precios, disponibilidad y presentación del negocio con permisos de personal. | Una modificación autorizada se refleja en la carta del negocio correspondiente; un usuario sin el permiso requerido no puede efectuarla. |
| RF-03 | El sistema debe permitir consultar la carta por QR desde el navegador y formar un pedido sin instalación ni registro obligatorio del comensal. | El QR abre el negocio y, cuando corresponda, la mesa previstos; un navegador sin sesión de personal puede enviar un pedido permitido. |
| RF-04 | El sistema debe confirmar los pedidos con precios, promociones y disponibilidad recalculados por el servidor. | El total enviado por el navegador no determina el importe confirmado; opciones inválidas y stock insuficiente se rechazan sin descontar inventario parcialmente. |
| RF-05 | El sistema debe reconocer los reintentos de un pedido mediante una clave de idempotencia acotada a su empresa. | Dos envíos concurrentes con la misma clave y contenido devuelven el mismo pedido y descuentan stock una vez; otro contenido con esa clave produce un error. |
| RF-06 | El sistema debe distribuir las comandas por estaciones de preparación y actualizar sus estados para cocina, caja y seguimiento del comensal. | El pedido aparece en las estaciones autorizadas del mismo negocio; los cambios se reflejan en caja y seguimiento sin enviarse a otro negocio. |
| RF-07 | El sistema debe gestionar turnos, edición autorizada de pedidos, registro de cobros, arqueo y cierre de caja. | El cobro comprueba los importes de los medios de pago y el efectivo recibido; el cierre conserva movimientos y diferencias del turno y exige permiso. |
| RF-08 | El sistema debe generar y permitir consultar una nota de venta interna asociada al cobro, con importes conservados para su reimpresión. | La nota corresponde al cobro registrado, puede obtenerse como PDF y se identifica como documento interno, sin presentarse como boleta o factura electrónica validada por SUNAT. |
| RF-09 | El sistema debe registrar ajustes y descuentos de inventario con trazabilidad del negocio y del usuario autorizado. | Las ventas concurrentes no producen stock negativo; anular o modificar una operación conserva los movimientos correspondientes y rechaza ajustes sin permiso. |
| RF-10 | El sistema debe permitir consultar reportes de ventas y caja por intervalos y exportar los resultados autorizados. | El reporte y su exportación mantienen el negocio y rango seleccionados; sus importes coinciden con las operaciones persistidas. |
| RF-11 | El sistema debe permitir administrar desde la plataforma el alta de negocios, sus planes, estado del servicio y acceso de soporte. | El alta utiliza un slug único; una cuenta del negocio no accede a la cartera de la plataforma y las visitas de soporte mantienen su alcance autorizado. |
| RF-12 | El sistema debe ofrecer fidelidad opcional con identificación del cliente y beneficios configurados por cada negocio. | Un cobro elegible acredita el beneficio correspondiente; una cuenta o beneficio de fidelidad no se utiliza en otro negocio fuera de su alcance autorizado. |

## Relación entre HU y Requisitos Funcionales

| Historia de usuario | Requisito funcional relacionado |
| :--- | :--- |
| HU01 Abrir la carta del negocio correcto | RF-01 |
| HU02 Mantener el catálogo y su presentación | RF-02 |
| HU03 Consultar por QR y formar un pedido | RF-03 |
| HU04 Confirmar precio y disponibilidad | RF-04 |
| HU05 Reintentar sin duplicar un pedido | RF-05 |
| HU06 Gestionar preparación y comunicar estados | RF-06 |
| HU07 Gestionar turno, cobro y cierre | RF-07 |
| HU08 Obtener la nota de venta interna | RF-08 |
| HU09 Gestionar inventario con trazabilidad | RF-09 |
| HU10 Consultar y exportar reportes | RF-10 |
| HU11 Administrar la plataforma y su soporte | RF-11 |
| HU12 Participar en fidelidad | RF-12 |

## Alcance de la aceptación

La comprobación debe utilizar al menos dos negocios y cuentas con permisos distintos, y cubrir el recorrido de pedido, preparación, cobro y cierre. Las operaciones autoritativas dependen del servidor y de PostgreSQL; el navegador y la caché no deciden precios, cobros ni existencias.

El sistema requiere conexión a internet. El registro de cobros no incluye una pasarela de pagos en línea; las notas de venta internas no constituyen emisión electrónica ante SUNAT.
