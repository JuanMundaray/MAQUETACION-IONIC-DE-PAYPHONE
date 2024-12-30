## Guía de uso: 

1) - [Importar el componente <app-recibo-pagos></app-recibo-pagos> donde se requiera generar el recibo.]

2) - [Se le necesita pasar como input la información necesaria para el recibo, este debe tener la estructura de la interfaz: "ReciboPago" <app-recibo-pagos [cliente]="cliente"></app-recibo-pagos>]

3) - [Llamar al método "crearPDF(elementID, curp)" del servicio "recibo.pagos" donde el primer parámetro es el ID del elemento del cual se quiere hacer una captura ya que en este se genera el pdf a través de la captura del elemento, en este caso el ID del contenedor del componente <app-recibo-pagos></app-recibo-pagos> es: "reciboPago". Y la curp del cliente la cual será utilizada en el nombre del archivo como identificador. Dicha curp es necesaria para la generación del archivo por lo cual deberíamos tener acceso a esta para el momento de generarla.]



