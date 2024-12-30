// script-chat-support.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScriptChatSupportService   {
  private counter:number = 0;  
  constructor() {}

  // Método para cargar el script y configurar el widget
  loadScriptAndMakeDraggable(
    scriptUrl = 'https://cdn.bitrix24.es/b16375491/crm/site_button/loader_6_3kk41i.js'
  ): void {

    if(this.counter > 0) return;

    this.counter++

    const script = document.createElement('script');
    script.src = scriptUrl + '?' + ((Date.now() / 60000) | 0);
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      this.waitForWidget('.b24-widget-button-position-bottom-right', (widget) => {
        this.removePositionClass(widget);
        this.makeWidgetDraggable(widget);
      });
    };
  }

  // Esperar que el widget esté disponible en el DOM
  private waitForWidget(selector: string, callback: (widget: HTMLElement) => void): void {
    const interval = setInterval(() => {
      const widget = document.querySelector(selector) as HTMLElement;
      if (widget) {
        clearInterval(interval);
        callback(widget);
      }
    }, 500);
  }

  // Remover la clase que fija la posición
  private removePositionClass(widget: HTMLElement): void {
    widget.classList.remove('b24-widget-button-wrapper');
    // Puedes remover otras clases si es necesario
  }


  // Hacer el widget arrastrable
  private makeWidgetDraggable(widget: HTMLElement): void {
    let isDragging = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;
  
    // Configuración de estilos iniciales
    widget.style.position = 'fixed';
    widget.style.cursor = 'move';
    widget.style.zIndex = '10000';
    widget.style.touchAction = 'none'; // Evita el comportamiento táctil predeterminado
  
    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      moved = false;
  
      startX = e.clientX;
      startY = e.clientY;
  
      const rect = widget.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
  
      e.stopPropagation();
      e.preventDefault();
    };
  
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
  
      const currentX = e.clientX;
      const currentY = e.clientY;
  
      const dx = currentX - startX;
      const dy = currentY - startY;
  
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        moved = true;
      }
  
      let x = initialX + dx;
      let y = initialY + dy;
  
      // Asegurar que el widget no salga del viewport
      const maxX = window.innerWidth - widget.offsetWidth;
      const maxY = window.innerHeight - widget.offsetHeight;
  
      x = Math.min(Math.max(0, x), maxX);
      y = Math.min(Math.max(0, y), maxY);
  
      widget.style.left = `${x}px`;
      widget.style.top = `${y}px`;
  
      e.preventDefault(); // Evita el comportamiento predeterminado durante el arrastre
    };
  
    const onPointerUp = (e: PointerEvent) => {
      if (isDragging) {
        isDragging = false;
      }
  
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
  
    // Eventos de puntero
    widget.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  
    // Evitar que los eventos de click se disparen durante el arrastre
    widget.addEventListener(
      'click',
      (e) => {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );
  }
  
}
