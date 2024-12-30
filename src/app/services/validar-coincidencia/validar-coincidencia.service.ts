import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidarCoincidenciaService {
  constructor() {}

  // Función principal para calcular la mejor coincidencia, considerando frases y palabras
  calcularCoincidencia(
    listaNegra: string[],
    nuevaSucursal: string
  ): { datoRecibido: string; elemento: string; porcentaje: number } {
    // Calcular la mejor coincidencia para frases
    const mejorCoincidenciaFrase = this.calcularMejorCoincidencia(
      nuevaSucursal,
      listaNegra
    );

    // Calcular la mejor coincidencia para palabras
    const mejorCoincidenciaPalabras = this.calcularCoincidenciaPalabras(
      nuevaSucursal,
      listaNegra
    );

    // Decidir cuál es la mejor coincidencia basándose en los porcentajes
    if (
      mejorCoincidenciaFrase.porcentaje > mejorCoincidenciaPalabras.porcentaje
    ) {
      return {
        datoRecibido: nuevaSucursal,
        elemento: mejorCoincidenciaFrase.elemento,
        porcentaje: mejorCoincidenciaFrase.porcentaje,
      };
    } else {
      return {
        datoRecibido: nuevaSucursal,
        elemento: mejorCoincidenciaPalabras.elemento,
        porcentaje: mejorCoincidenciaPalabras.porcentaje,
      };
    }
  }

  // Función para calcular la mejor coincidencia de frases
  private calcularMejorCoincidencia(
    datoRecibido: string,
    listaNegra: string[]
  ): { elemento: string; porcentaje: number } {
    let mejorCoincidencia = '';
    let porcentajeMejorCoincidencia = 0;

    listaNegra.forEach((sucursal) => {
      // Calcular el porcentaje de coincidencia para cada elemento en la lista
      const porcentajeCoincidencia = this.calcularPorcentajeCoincidencia(
        datoRecibido,
        sucursal
      );

      // Actualizar si encontramos una mejor coincidencia
      if (porcentajeCoincidencia > porcentajeMejorCoincidencia) {
        mejorCoincidencia = sucursal;
        porcentajeMejorCoincidencia = porcentajeCoincidencia;
      }
    });

    // Devolver la mejor coincidencia y su porcentaje
    return {
      elemento: mejorCoincidencia,
      porcentaje: porcentajeMejorCoincidencia,
    };
  }

  // Función para calcular la mejor coincidencia de palabras
  private calcularCoincidenciaPalabras(
    datoRecibido: string,
    listaNegra: string[]
  ): { elemento: string; porcentaje: number } {
    let mejorCoincidenciaPalabras = '';
    let porcentajeMejorCoincidenciaPalabras = 0;

    listaNegra.forEach((sucursal) => {
      // Calcular el porcentaje de coincidencia para palabras
      const porcentajeCoincidenciaPalabras =
        this.calcularPorcentajeCoincidenciaPalabras(datoRecibido, sucursal);

      // Actualizar si encontramos una mejor coincidencia de palabras
      if (
        porcentajeCoincidenciaPalabras > porcentajeMejorCoincidenciaPalabras
      ) {
        mejorCoincidenciaPalabras = sucursal;
        porcentajeMejorCoincidenciaPalabras = porcentajeCoincidenciaPalabras;
      }
    });

    // Devolver la mejor coincidencia de palabras y su porcentaje
    return {
      elemento: mejorCoincidenciaPalabras,
      porcentaje: porcentajeMejorCoincidenciaPalabras,
    };
  }

  // Función para calcular el porcentaje de coincidencia de palabras
  private calcularPorcentajeCoincidenciaPalabras(
    datoRecibido: string,
    sucursal: string
  ): number {
    // Dividir la frase en palabras
    const palabrasRecibido = datoRecibido.toLowerCase().split(' ');
    const palabrasSucursal = sucursal.toLowerCase().split(' ');

    // Contar las coincidencias de palabras
    const coincidencias = palabrasRecibido.filter((palabra) =>
      palabrasSucursal.includes(palabra)
    ).length;

    // Calcular el porcentaje de coincidencia para palabras
    const porcentaje1 = coincidencias / palabrasRecibido.length;
    const porcentaje2 = coincidencias / palabrasSucursal.length;

    return ((porcentaje1 + porcentaje2) / 2) * 100;
  }

  // Función para calcular el porcentaje de coincidencia de caracteres
  private calcularPorcentajeCoincidencia(
    datoRecibido: string,
    sucursal: string
  ): number {
    // Contar las coincidencias de caracteres
    const coincidencias = this.contarCoincidencias(
      datoRecibido.toLowerCase(),
      sucursal.toLowerCase()
    );

    // Calcular el porcentaje de coincidencia para caracteres
    const porcentaje1 = coincidencias / datoRecibido.length;
    const porcentaje2 = coincidencias / sucursal.length;

    return ((porcentaje1 + porcentaje2) / 2) * 100;
  }

  // Función para contar las coincidencias de caracteres
  private contarCoincidencias(datoRecibido: string, sucursal: string): number {
    let coincidencias = 0;
    let minLength = Math.min(datoRecibido.length, sucursal.length);

    // Iterar sobre los caracteres y contar las coincidencias
    for (let i = 0; i < minLength; i++) {
      if (datoRecibido[i] === sucursal[i]) {
        coincidencias++;
      }
    }

    // Devolver el número de coincidencias
    return coincidencias;
  }
}
