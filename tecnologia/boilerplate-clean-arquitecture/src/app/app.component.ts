// PRESENTACIÓN · Las dos vistas del ejemplo de clase, adaptadas a Venddy.
import { Component, inject } from '@angular/core';
import { CatalogoComponent } from './presentacion/catalogo/catalogo.component';
import { CarritoComponent } from './presentacion/carrito/carrito.component';
import { EstadoCarrito } from './presentacion/estado-carrito.servicio';

@Component({
  selector: 'app-root', standalone: true,
  imports: [CatalogoComponent, CarritoComponent],
  template: `
    <main>
      <header class="encabezado">
        <p class="marca">VENDDY · CARTA QR</p>
        <h1>{{ estadoCarrito.negocioNombre }}</h1>
        <p>Mesa {{ estadoCarrito.mesa }} · {{ estadoCarrito.negocioId }}</p>
        <nav aria-label="Vistas de carta y carrito">
          <button [class.activo]="vista === 'catalogo'" (click)="vista = 'catalogo'">Carta</button>
          <button [class.activo]="vista === 'carrito'" (click)="vista = 'carrito'">
            Carrito ({{ estadoCarrito.cantidadDeItems() }})
          </button>
        </nav>
      </header>
      @if (vista === 'catalogo') { <app-catalogo /> } @else { <app-carrito /> }
      <footer>Demostración académica · Los datos se reinician al recargar.</footer>
    </main>
  `,
  styles: [`
    main { max-width: 960px; margin: 0 auto; padding: 24px; }
    .encabezado { border-bottom: 2px solid #215c50; padding-bottom: 16px; margin-bottom: 24px; }
    h1 { color: #215c50; font-size: 26px; margin: 0 0 8px; }
    .marca { color: #5c706a; font-size: 12px; letter-spacing: 2px; font-weight: bold; }
    nav { display: flex; gap: 8px; margin-top: 16px; }
    nav button { padding: 9px 18px; border: 1px solid #215c50; border-radius: 6px; background: #fff; color: #215c50; cursor: pointer; }
    nav button.activo { background: #215c50; color: #fff; }
    footer { margin-top: 32px; color: #66736f; font-size: 12px; }
  `],
})
export class AppComponent {
  readonly estadoCarrito = inject(EstadoCarrito);
  vista: 'catalogo' | 'carrito' = 'catalogo';
}
