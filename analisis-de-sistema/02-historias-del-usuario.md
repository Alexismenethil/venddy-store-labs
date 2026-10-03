# Historias de Usuario

Las historias describen el valor esperado para los actores de Venddy. Los identificadores RF-01 a RF-12 conservan la trazabilidad con el informe de arquitectura; los criterios son condiciones para comprobar el comportamiento, no resultados de una nueva prueba de aceptación.

| ID | Historia de usuario | Requisito relacionado | Criterio de aceptación |
| :--- | :--- | :--- | :--- |
| HU01 | Como comensal, quiero abrir la carta del negocio correcto mediante su subdominio, para consultar únicamente su oferta. | RF-01 | Cada negocio registrado muestra su propia carta; un subdominio inexistente devuelve 404 y el dominio raíz no selecciona un negocio. |
| HU02 | Como administrador del negocio, quiero mantener catálogo, precios, disponibilidad y presentación, para ofrecer información vigente a mis clientes. | RF-02 | Un cambio autorizado aparece en la carta del mismo negocio; un usuario sin permiso no puede efectuarlo. |
| HU03 | Como comensal, quiero abrir la carta por QR y formar un pedido en el navegador, para solicitar mi consumo sin instalar una aplicación ni registrarme obligatoriamente. | RF-03 | El QR dirige al negocio y, cuando corresponda, a la mesa previstos; un comensal sin sesión de personal puede enviar un pedido permitido. |
| HU04 | Como comensal, quiero que el servidor confirme el precio y la disponibilidad de mi pedido, para recibir un total coherente con lo que realmente puedo solicitar. | RF-04 | Alterar el total del navegador no modifica el importe confirmado; opciones inválidas o stock insuficiente se rechazan sin descuentos parciales. |
| HU05 | Como comensal, quiero reintentar el envío de mi pedido sin duplicarlo, para recuperarme de un problema de conexión. | RF-05 | La misma clave y contenido devuelven un solo pedido y descuentan stock una vez; reutilizar la clave con otro contenido produce un error. |
| HU06 | Como personal de preparación, quiero recibir las comandas de mis estaciones y actualizar sus estados, para coordinar la cocina y comunicar el avance a caja y al comensal. | RF-06 | Las comandas llegan a las estaciones autorizadas del negocio; sus cambios se reflejan en caja y seguimiento sin llegar a otro negocio. |
| HU07 | Como cajero, quiero gestionar mi turno, registrar cobros, realizar arqueo y cerrar caja, para controlar las operaciones y los importes del turno. | RF-07 | El cobro valida la suma de los medios de pago y el efectivo recibido; el cierre conserva movimientos y diferencias y exige autorización. |
| HU08 | Como cajero, quiero generar y reimprimir la nota de venta interna de un cobro, para entregar un registro coherente al comensal. | RF-08 | La nota corresponde al cobro persistido, está disponible como PDF y se identifica como documento interno. |
| HU09 | Como administrador del negocio, quiero registrar ajustes y consultar los movimientos de inventario, para conocer las existencias y evitar ventas por encima del stock. | RF-09 | Ventas concurrentes no generan stock negativo; ajustes y cambios conservan trazabilidad y requieren los permisos correspondientes. |
| HU10 | Como administrador del negocio, quiero consultar y exportar reportes por intervalos, para analizar mis ventas y resultados de caja. | RF-10 | Los datos y la exportación corresponden únicamente al negocio y rango autorizados y coinciden con las operaciones persistidas. |
| HU11 | Como operador de la plataforma, quiero administrar negocios, planes, estado del servicio y visitas de soporte, para gestionar la operación de Venddy. | RF-11 | El alta exige un slug único; cuentas del negocio no acceden a la cartera y el soporte respeta su alcance autorizado. |
| HU12 | Como cliente de fidelidad, quiero identificarme y recibir los beneficios habilitados por el negocio, para participar en su programa de clientes. | RF-12 | Un cobro elegible acredita el beneficio configurado; la cuenta y los beneficios mantienen el alcance del negocio correspondiente. |

Estas historias tienen soporte funcional en el código revisado para el informe. Su aceptación integral deberá ejecutarse en el entorno de lanzamiento, incluidos subdominios, sesiones, concurrencia y reconexión.

El registro de un medio de pago no procesa un pago en línea. La nota de venta es interna; la emisión electrónica ante SUNAT y la operación sin conexión permanecen fuera del alcance implementado.
