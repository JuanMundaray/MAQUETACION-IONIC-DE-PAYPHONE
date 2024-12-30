import { Component, Input, OnInit } from '@angular/core';
import { ReciboPago } from '../../interfaces/interfaces_recibos'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recibo-pagos',
  templateUrl: './recibo-pagos.component.html',
  styleUrls: ['./recibo-pagos.component.css']
})
export class ReciboPagosComponent implements OnInit {
  @Input() cliente: ReciboPago;
  
  public COMPANY_NAME:string=environment.COMPANY_NAME;

  constructor() { }

  ngOnInit(): void {
  }
}
