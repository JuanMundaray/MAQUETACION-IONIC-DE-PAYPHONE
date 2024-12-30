import { Injectable } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';

@Injectable({
  providedIn: 'root',
})
export class BajarResolImgService {
  constructor(private imageCompress: NgxImageCompressService) {}

  compressImage(originalImage: File, quality: number = 75): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('No se pudo obtener el contexto 2D del canvas.'));
            return;
          }

          // const maxWidth = 1280; // ajusta esto según tus necesidades
          // const maxHeight = 960; // ajusta esto según tus necesidades
          const maxWidth = 1800; // ajusta esto según tus necesidades
          const maxHeight = 2700; // ajusta esto según tus necesidades

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          const base64Image = canvas.toDataURL('image/jpeg', quality / 100);

          this.imageCompress
            .compressFile(base64Image, 0, quality, quality)
            .then(
              (result: string) => {
                const blob = this.dataURItoBlob(result);
                resolve(blob);
              },
              (error: any) => {
                reject(error);
              }
            );
        };

        img.onerror = (error) => {
          reject(error);
        };
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(originalImage);
    });
  }

  //verificar tama;o del archivo
  base64ToBlob(base64Image: string): Blob {
    const byteString = atob(base64Image.split(',')[1]);
    const mimeString = base64Image.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  }

  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  }

  compressImageB64FM(originalImage: File, quality: number = 95,
    maxW : number = 600,
    maxH : number = 800): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('No se pudo obtener el contexto 2D del canvas.'));
            return;
          }

          console.log('mw: ',maxW)
          console.log('mh: ',maxH)
          const maxWidth = maxW; // ajusta esto según tus necesidades
          const maxHeight = maxH; // ajusta esto según tus necesidades

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          console.log('Q: ',quality)
          const base64Image = canvas.toDataURL('image/jpeg', quality / 100);

          this.imageCompress
            .compressFile(base64Image, 0, quality, quality)
            .then(
              (result: string) => {
                const compressedSize = this.base64ToBlob(result).size;
                const compressedSizeMB = compressedSize / (1024 * 1024); // Convertir bytes a megabytes
                console.log('Tamaño comprimido del archivo:', compressedSizeMB.toFixed(2), 'MB');
              
                // Limpiar canvas y su contexto
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.width = 0;
                canvas.height = 0;

                resolve(result); // Devuelve la cadena Base64 resultante
              },
              (error: any) => {
                reject(error);
              }
            );
        };

        img.onerror = (error) => {
          reject(error);
        };
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(originalImage);
    });
  }

  compressImageB64(
    originalImage: File,
    targetWidth: number = 700,
    targetHeight: number = 1280
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;
  
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
          if (!ctx) {
            reject(new Error('No se pudo obtener el contexto 2D del canvas.'));
            return;
          }
  
          let width = img.width;
          let height = img.height;
  
          // Ajustar las dimensiones manteniendo la relación de aspecto
          if (width > height) {
            if (width > targetWidth) {
              height = Math.round((height *= targetWidth / width));
              width = targetWidth;
            }
          } else {
            if (height > targetHeight) {
              width = Math.round((width *= targetHeight / height));
              height = targetHeight;
            }
          }
  
          canvas.width = width;
          canvas.height = height;
  
          ctx.drawImage(img, 0, 0, width, height);
  
          // Generar la imagen en formato JPEG sin cambiar la calidad
          const resizedImage = canvas.toDataURL('image/jpeg');
  
          // Limpiar el contexto y el canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          canvas.width = 0;
          canvas.height = 0;
  
          resolve(resizedImage); // Devuelve la cadena Base64 resultante
        };
  
        img.onerror = (error) => {
          reject(new Error('Error al cargar la imagen.'));
        };
      };
  
      reader.onerror = (error) => {
        reject(new Error('Error al leer el archivo.'));
      };
  
      reader.readAsDataURL(originalImage);
    });
  }
  

  //una tercera alternativa con parametros ajustables
  compressImageB64_2(originalImage: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 75): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event: any) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('No se pudo obtener el contexto 2D del canvas.'));
                    return;
                }

                let width = img.width;
                let height = img.height;

                const aspectRatio = width / height;
                const targetWidth = Math.min(maxWidth, width);
                const targetHeight = Math.min(maxHeight, height);

                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        height = targetWidth / aspectRatio;
                        width = targetWidth;
                    } else {
                        width = targetHeight * aspectRatio;
                        height = targetHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, width, height);

                const base64Image = canvas.toDataURL('image/jpeg', quality / 100);

                this.imageCompress
                    .compressFile(base64Image, 0, quality, quality)
                    .then(
                        (result: string) => {
                          const compressedSize = this.base64ToBlob(result).size;
                          const compressedSizeMB = compressedSize / (1024 * 1024); // Convertir bytes a megabytes
                          console.log('Tamaño comprimido del archivo:', compressedSizeMB.toFixed(2), 'MB');

                          // Limpiar canvas y su contexto
                          ctx.clearRect(0, 0, canvas.width, canvas.height);
                          canvas.width = 0;
                          canvas.height = 0;

                          resolve(result); // Devuelve la cadena Base64 resultante
                        },
                        (error: any) => {
                            reject(error);
                        }
                    );
            };

            img.onerror = (error) => {
                reject(error);
            };
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(originalImage);
    });
  }
}
